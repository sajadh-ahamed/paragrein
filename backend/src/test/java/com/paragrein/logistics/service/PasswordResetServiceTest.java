package com.paragrein.logistics.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.paragrein.logistics.dto.ForgotPasswordRequest;
import com.paragrein.logistics.dto.MessageResponse;
import com.paragrein.logistics.dto.ResetPasswordRequest;
import com.paragrein.logistics.entity.PasswordResetToken;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.enums.AccountStatus;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.PasswordResetTokenRepository;
import com.paragrein.logistics.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

class PasswordResetServiceTest {

    private UserRepository userRepository;
    private PasswordResetTokenRepository tokenRepository;
    private JavaMailSender mailSender;
    private PasswordResetService service;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        tokenRepository = mock(PasswordResetTokenRepository.class);
        mailSender = mock(JavaMailSender.class);
        service = new PasswordResetService(
                userRepository,
                tokenRepository,
                mock(AuditLogRepository.class),
                mock(PasswordEncoder.class),
                mailSender,
                "no-reply@paragrein.local",
                "http://localhost:5173/reset-password",
                30
        );
    }

    @Test
    void forgotPasswordReturnsGenericMessageForUnknownEmail() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("unknown@paragrein.local");
        when(userRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.empty());

        MessageResponse response = service.forgotPassword(request);

        assertEquals(PasswordResetService.FORGOT_SUCCESS, response.message());
        verifyNoInteractions(tokenRepository, mailSender);
    }

    @Test
    void resetPasswordRejectsExpiredToken() {
        PasswordResetToken token = validToken();
        token.setExpiresAt(LocalDateTime.now().minusMinutes(1));
        when(tokenRepository.findByToken(anyString())).thenReturn(Optional.of(token));

        AppException exception = assertThrows(AppException.class, () -> service.resetPassword(resetRequest()));

        assertEquals("Reset link is invalid or expired.", exception.getMessage());
    }

    @Test
    void resetPasswordRejectsUsedToken() {
        PasswordResetToken token = validToken();
        token.setUsedAt(LocalDateTime.now().minusMinutes(1));
        when(tokenRepository.findByToken(anyString())).thenReturn(Optional.of(token));

        AppException exception = assertThrows(AppException.class, () -> service.resetPassword(resetRequest()));

        assertEquals("Reset link is invalid or expired.", exception.getMessage());
    }

    private PasswordResetToken validToken() {
        User user = new User();
        user.setAccountStatus(AccountStatus.ACTIVE);
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        return token;
    }

    private ResetPasswordRequest resetRequest() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("valid-looking-token");
        request.setNewPassword("Password@321");
        request.setConfirmPassword("Password@321");
        return request;
    }
}
