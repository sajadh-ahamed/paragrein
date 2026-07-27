package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.AuditLogResponse;
import com.paragrein.logistics.service.AuditLogService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/audit-logs")
public class AdminAuditLogController {

    private final AuditLogService auditLogService;

    public AdminAuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public List<AuditLogResponse> getAuditLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo
    ) {
        return auditLogService.getAuditLogs(action, entityType, username, dateFrom, dateTo);
    }

    @GetMapping("/recent")
    public List<AuditLogResponse> getRecentAuditLogs() {
        return auditLogService.getRecentAuditLogs();
    }

    @GetMapping("/user/{userId}")
    public List<AuditLogResponse> getAuditLogsByUser(@PathVariable Long userId) {
        return auditLogService.getAuditLogsByUser(userId);
    }

    @GetMapping("/entity")
    public List<AuditLogResponse> getAuditLogsByEntity(
            @RequestParam String entityType,
            @RequestParam Long entityId
    ) {
        return auditLogService.getAuditLogsByEntity(entityType, entityId);
    }
}
