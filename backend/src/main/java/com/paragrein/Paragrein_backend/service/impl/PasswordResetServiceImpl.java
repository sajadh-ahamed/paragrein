package com.paragrein.Paragrein_backend.service.impl;

import com.paragrein.Paragrein_backend.entity.PasswordResetToken;
import com.paragrein.Paragrein_backend.entity.User;
import com.paragrein.Paragrein_backend.repository.PasswordResetTokenRepository;
import com.paragrein.Paragrein_backend.repository.UserRepository;
import com.paragrein.Paragrein_backend.service.EmailService;
import com.paragrein.Paragrein_backend.service.PasswordResetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetServiceImpl.class);

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetServiceImpl(PasswordResetTokenRepository tokenRepository,
                                    UserRepository userRepository,
                                    EmailService emailService,
                                    PasswordEncoder passwordEncoder) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Value("${app.frontend.reset-url}")
    private String frontendResetUrl;

    @Override
    @Transactional
    public void createAndSendToken(User user) {
        List<PasswordResetToken> activeTokens = tokenRepository.findByUserAndUsedFalse(user);
        for (PasswordResetToken activeToken : activeTokens) {
            activeToken.setUsed(true);
        }

        String tokenValue = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(tokenValue);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);

        tokenRepository.save(resetToken);

        String resetLink = frontendResetUrl + "/" + tokenValue;
        String subject = "Password Reset Request - Paragrein Logistics";
        String body = "Dear " + user.getUsername() + ",\n\n"
                + "Click the link below to reset your password:\n"
                + resetLink + "\n\n"
                + "This link expires in 15 minutes.\n\n"
                + "Regards,\nParagrein Admin";

        emailService.sendEmail(user.getEmail(), subject, body);
        log.info("Password reset token created for user {}. Local reset link: {}", user.getEmail(), resetLink);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByTokenAndUsedFalse(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token."));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            resetToken.setUsed(true);
            tokenRepository.save(resetToken);
            throw new IllegalArgumentException("Reset token has expired.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }
}
