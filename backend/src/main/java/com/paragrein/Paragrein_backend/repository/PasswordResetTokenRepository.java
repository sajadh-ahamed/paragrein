package com.paragrein.Paragrein_backend.repository;

import com.paragrein.Paragrein_backend.entity.PasswordResetToken;
import com.paragrein.Paragrein_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByTokenAndUsedFalse(String token);

    List<PasswordResetToken> findByUserAndUsedFalse(User user);
}
