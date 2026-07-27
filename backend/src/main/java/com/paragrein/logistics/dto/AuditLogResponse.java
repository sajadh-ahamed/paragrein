package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.enums.RoleCode;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AuditLogResponse {

    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private RoleCode role;
    private String action;
    private String entityType;
    private Long entityId;
    private String description;
    private LocalDateTime createdAt;

    public AuditLogResponse(AuditLog auditLog) {
        this.id = auditLog.getId();
        this.userId = auditLog.getUser() == null ? null : auditLog.getUser().getId();
        this.username = auditLog.getUser() == null ? "System" : auditLog.getUser().getUsername();
        this.fullName = auditLog.getUser() == null ? "System" : auditLog.getUser().getFullName();
        this.role = auditLog.getUser() == null ? null : auditLog.getUser().getRole().getCode();
        this.action = auditLog.getAction();
        this.entityType = auditLog.getEntityType();
        this.entityId = auditLog.getEntityId();
        this.description = auditLog.getDescription();
        this.createdAt = auditLog.getCreatedAt();
    }
}
