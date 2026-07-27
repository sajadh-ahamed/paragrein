package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.PasswordResetToken;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    @EntityGraph(attributePaths = "user")
    Optional<PasswordResetToken> findByToken(String token);

    List<PasswordResetToken> findByUserIdAndUsedAtIsNull(Long userId);
}
