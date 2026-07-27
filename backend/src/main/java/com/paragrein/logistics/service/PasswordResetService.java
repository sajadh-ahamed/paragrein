package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.ForgotPasswordRequest;
import com.paragrein.logistics.dto.MessageResponse;
import com.paragrein.logistics.dto.ResetPasswordRequest;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.PasswordResetToken;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.enums.AccountStatus;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.PasswordResetTokenRepository;
import com.paragrein.logistics.repository.UserRepository;
import com.paragrein.logistics.security.PasswordPolicy;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PasswordResetService {

    public static final String FORGOT_SUCCESS = "If an account exists for this email, a reset link has been sent.";
    public static final String RESET_SUCCESS = "Password reset successfully. Please login with your new password.";
    private static final String INVALID_TOKEN = "Reset link is invalid or expired.";
    private static final Logger LOGGER = LoggerFactory.getLogger(PasswordResetService.class);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final String mailFrom;
    private final String resetPasswordUrl;
    private final long expiryMinutes;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            AuditLogRepository auditLogRepository,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender,
            @Value("${app.mail.from}") String mailFrom,
            @Value("${app.frontend.reset-password-url}") String resetPasswordUrl,
            @Value("${app.password-reset.expiry-minutes:30}") long expiryMinutes
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.mailFrom = mailFrom;
        this.resetPasswordUrl = resetPasswordUrl;
        this.expiryMinutes = expiryMinutes;
    }

    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        String email = request == null ? null : clean(request.getEmail());
        if (!isValidEmail(email)) {
            throw new AppException("Please enter a valid email address.", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByEmailIgnoreCase(email.toLowerCase(Locale.ROOT)).orElse(null);
        // Security note: unknown and non-active accounts receive the same response to prevent account enumeration.
        if (user == null || user.getAccountStatus() != AccountStatus.ACTIVE) {
            return new MessageResponse(FORGOT_SUCCESS);
        }

        LocalDateTime now = LocalDateTime.now();
        tokenRepository.findByUserIdAndUsedAtIsNull(user.getId()).forEach(token -> token.setUsedAt(now));

        String rawToken = generateToken();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(hashToken(rawToken));
        resetToken.setExpiresAt(now.plusMinutes(expiryMinutes));
        tokenRepository.save(resetToken);

        try {
            mailSender.send(buildResetEmail(user, rawToken));
        } catch (MailException exception) {
            LOGGER.error("Password reset email delivery failed. Ensure Papercut SMTP is running on localhost:2525.", exception);
            throw new AppException("Unable to send reset email. Please check local email server.", HttpStatus.SERVICE_UNAVAILABLE);
        }

        return new MessageResponse(FORGOT_SUCCESS);
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        if (request == null || isBlank(request.getToken()) || isBlank(request.getNewPassword()) || isBlank(request.getConfirmPassword())) {
            throw new AppException("Reset token, new password, and confirm password are required.", HttpStatus.BAD_REQUEST);
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException("Password and confirm password do not match.", HttpStatus.BAD_REQUEST);
        }
        if (!PasswordPolicy.isStrong(request.getNewPassword())) {
            throw new AppException(PasswordPolicy.REQUIREMENTS, HttpStatus.BAD_REQUEST);
        }

        PasswordResetToken resetToken = tokenRepository.findByToken(hashToken(clean(request.getToken())))
                .orElseThrow(() -> invalidToken());
        LocalDateTime now = LocalDateTime.now();
        if (resetToken.getUsedAt() != null || resetToken.getExpiresAt() == null || !resetToken.getExpiresAt().isAfter(now)) {
            throw invalidToken();
        }

        User user = resetToken.getUser();
        if (user == null || user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw invalidToken();
        }

        // Business rule: a reset token is single-use and is consumed in the same transaction as the BCrypt password update.
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        resetToken.setUsedAt(now);
        userRepository.save(user);
        tokenRepository.save(resetToken);
        saveAudit(user, "PASSWORD_RESET_SUCCESS", "User", user.getId(), "User password reset completed successfully.");
        return new MessageResponse(RESET_SUCCESS);
    }

    private SimpleMailMessage buildResetEmail(User user, String rawToken) {
        String resetLink = resetPasswordUrl + "?token=" + URLEncoder.encode(rawToken, StandardCharsets.UTF_8);
        String fullName = isBlank(user.getFullName()) ? "Paragrein user" : user.getFullName().trim();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(user.getEmail());
        message.setSubject("Paragrein Password Reset Request");
        message.setText("Hello " + fullName + ",\n\n"
                + "A password reset request was received for your Paragrein account.\n\n"
                + "Use the link below to reset your password:\n"
                + resetLink + "\n\n"
                + "This link will expire in " + expiryMinutes + " minutes.\n\n"
                + "If you did not request this, please ignore this email.\n\n"
                + "Paragrein Logistics");
        return message;
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available.", exception);
        }
    }

    private void saveAudit(User user, String action, String entityType, Long entityId, String description) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUser(user);
        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setDescription(description);
        auditLogRepository.save(auditLog);
    }

    private AppException invalidToken() {
        return new AppException(INVALID_TOKEN, HttpStatus.BAD_REQUEST);
    }

    private boolean isValidEmail(String email) {
        return !isBlank(email) && email.length() <= 150 && email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}
