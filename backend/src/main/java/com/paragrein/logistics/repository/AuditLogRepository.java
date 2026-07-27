package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.AuditLog;
import java.util.List;

import com.paragrein.logistics.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @EntityGraph(attributePaths = {"user", "user.role"})
    List<AuditLog> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"user", "user.role"})
    List<AuditLog> findTop25ByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"user", "user.role"})
    List<AuditLog> findByUserIdOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = {"user", "user.role"})
    List<AuditLog> findByEntityTypeIgnoreCaseAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId);

    void deleteByUser(User user);
}
