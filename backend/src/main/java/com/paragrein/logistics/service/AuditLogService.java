package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.AuditLogResponse;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.repository.AuditLogRepository;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogs(String action, String entityType, String username, LocalDateTime dateFrom, LocalDateTime dateTo) {
        // Security note: audit logs are exposed only through admin controllers and remain read-only.
        return auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(log -> matches(action, log.getAction()))
                .filter(log -> matches(entityType, log.getEntityType()))
                .filter(log -> username == null || username.isBlank()
                        || (log.getUser() != null && contains(log.getUser().getUsername(), username))
                        || (log.getUser() != null && contains(log.getUser().getFullName(), username)))
                .filter(log -> dateFrom == null || !log.getCreatedAt().isBefore(dateFrom))
                .filter(log -> dateTo == null || !log.getCreatedAt().isAfter(dateTo))
                .map(AuditLogResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogsByUser(Long userId) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(AuditLogResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogsByEntity(String entityType, Long entityId) {
        if (entityType == null || entityType.isBlank() || entityId == null) {
            return List.of();
        }
        return auditLogRepository.findByEntityTypeIgnoreCaseAndEntityIdOrderByCreatedAtDesc(entityType.trim(), entityId).stream()
                .map(AuditLogResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getRecentAuditLogs() {
        return auditLogRepository.findTop25ByOrderByCreatedAtDesc().stream()
                .sorted(Comparator.comparing(AuditLog::getCreatedAt).reversed())
                .map(AuditLogResponse::new)
                .toList();
    }

    private boolean matches(String expected, String actual) {
        return expected == null || expected.isBlank() || contains(actual, expected);
    }

    private boolean contains(String actual, String search) {
        return actual != null && actual.toLowerCase(Locale.ROOT).contains(search.trim().toLowerCase(Locale.ROOT));
    }
}
