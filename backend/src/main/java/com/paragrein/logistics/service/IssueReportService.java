package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.AdminIssueResponseRequest;
import com.paragrein.logistics.dto.IssueReportRequest;
import com.paragrein.logistics.dto.IssueReportResponse;
import com.paragrein.logistics.dto.IssueStatusUpdateRequest;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.IssueReport;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.enums.IssueStatus;
import com.paragrein.logistics.enums.NotificationType;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.IssueReportRepository;
import com.paragrein.logistics.security.SecurityUserUtil;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IssueReportService {

    private final IssueReportRepository issueReportRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationService notificationService;

    public IssueReportService(
            IssueReportRepository issueReportRepository,
            AuditLogRepository auditLogRepository,
            NotificationService notificationService
    ) {
        this.issueReportRepository = issueReportRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public IssueReportResponse createIssueReport(IssueReportRequest request, Authentication authentication) {
        User reporter = SecurityUserUtil.requireCurrentUser(authentication);
        validateIssueRequest(request);

        IssueReport issue = new IssueReport();
        issue.setReportedByUser(reporter);
        issue.setTitle(clean(request.getTitle()));
        issue.setDescription(clean(request.getDescription()));
        issue.setSeverity(request.getSeverity());
        issue.setIssueStatus(IssueStatus.OPEN);
        IssueReport saved = issueReportRepository.save(issue);

        saveAudit(reporter, "ISSUE_REPORTED", "IssueReport", saved.getId(), "Created issue report: " + saved.getTitle());
        return new IssueReportResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<IssueReportResponse> getMyIssueReports(Authentication authentication) {
        User reporter = SecurityUserUtil.requireCurrentUser(authentication);
        return issueReportRepository.findByReportedByUserIdOrderByCreatedAtDesc(reporter.getId()).stream()
                .map(IssueReportResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public IssueReportResponse getIssueDetail(Long issueId, Authentication authentication) {
        User reporter = SecurityUserUtil.requireCurrentUser(authentication);
        // Security note: reporters can view only issues submitted from their own account.
        return new IssueReportResponse(issueReportRepository.findByIdAndReportedByUserId(issueId, reporter.getId())
                .orElseThrow(() -> new AppException("Issue report not found.", HttpStatus.NOT_FOUND)));
    }

    @Transactional(readOnly = true)
    public List<IssueReportResponse> getAllIssueReportsForAdmin() {
        return issueReportRepository.findAll().stream()
                .sorted(Comparator.comparing(IssueReport::getCreatedAt).reversed())
                .map(IssueReportResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public IssueReportResponse getAdminIssueDetail(Long issueId) {
        return new IssueReportResponse(issueReportRepository.findById(issueId)
                .orElseThrow(() -> new AppException("Issue report not found.", HttpStatus.NOT_FOUND)));
    }

    @Transactional
    public IssueReportResponse updateIssueStatus(Long issueId, IssueStatusUpdateRequest request, Authentication authentication) {
        User admin = SecurityUserUtil.requireCurrentUser(authentication);
        if (request == null || request.getIssueStatus() == null) {
            throw new AppException("Issue status is required.", HttpStatus.BAD_REQUEST);
        }
        IssueReport issue = issueReportRepository.findById(issueId)
                .orElseThrow(() -> new AppException("Issue report not found.", HttpStatus.NOT_FOUND));
        IssueStatus previousStatus = issue.getIssueStatus();
        issue.setIssueStatus(request.getIssueStatus());
        // Business rule: resolved and closed issues record the responsible admin and timestamp.
        if (request.getIssueStatus() == IssueStatus.RESOLVED || request.getIssueStatus() == IssueStatus.CLOSED) {
            issue.setResolvedByUser(admin);
            issue.setResolvedAt(LocalDateTime.now());
        }
        IssueReport saved = issueReportRepository.save(issue);

        saveAudit(admin, "ISSUE_STATUS_UPDATED", "IssueReport", saved.getId(), "Issue status changed from " + previousStatus + " to " + saved.getIssueStatus());
        notificationService.createNotification(saved.getReportedByUser(), "Issue status updated", "Your issue \"" + saved.getTitle() + "\" is now " + saved.getIssueStatus() + ".", NotificationType.ISSUE);
        return new IssueReportResponse(saved);
    }

    @Transactional
    public IssueReportResponse respondToIssue(Long issueId, AdminIssueResponseRequest request, Authentication authentication) {
        User admin = SecurityUserUtil.requireCurrentUser(authentication);
        if (request == null || isBlank(request.getAdminResponse())) {
            throw new AppException("Admin response is required.", HttpStatus.BAD_REQUEST);
        }
        IssueReport issue = issueReportRepository.findById(issueId)
                .orElseThrow(() -> new AppException("Issue report not found.", HttpStatus.NOT_FOUND));
        issue.setAdminResponse(clean(request.getAdminResponse()));
        if (issue.getIssueStatus() == IssueStatus.OPEN) {
            issue.setIssueStatus(IssueStatus.IN_PROGRESS);
        }
        IssueReport saved = issueReportRepository.save(issue);

        saveAudit(admin, "ISSUE_RESPONSE_ADDED", "IssueReport", saved.getId(), "Admin response added to issue: " + saved.getTitle());
        notificationService.createNotification(saved.getReportedByUser(), "Admin responded to your issue", "Admin response added for issue \"" + saved.getTitle() + "\".", NotificationType.ISSUE);
        return new IssueReportResponse(saved);
    }

    @Transactional
    public IssueReportResponse closeIssue(Long issueId, Authentication authentication) {
        User admin = SecurityUserUtil.requireCurrentUser(authentication);
        IssueReport issue = issueReportRepository.findById(issueId)
                .orElseThrow(() -> new AppException("Issue report not found.", HttpStatus.NOT_FOUND));
        issue.setIssueStatus(IssueStatus.CLOSED);
        issue.setResolvedByUser(admin);
        issue.setResolvedAt(LocalDateTime.now());
        IssueReport saved = issueReportRepository.save(issue);

        saveAudit(admin, "ISSUE_CLOSED", "IssueReport", saved.getId(), "Closed issue report: " + saved.getTitle());
        notificationService.createNotification(saved.getReportedByUser(), "Issue closed", "Your issue \"" + saved.getTitle() + "\" has been closed.", NotificationType.ISSUE);
        return new IssueReportResponse(saved);
    }

    private void validateIssueRequest(IssueReportRequest request) {
        if (request == null || isBlank(request.getTitle())) {
            throw new AppException("Issue title is required.", HttpStatus.BAD_REQUEST);
        }
        if (isBlank(request.getDescription())) {
            throw new AppException("Issue description is required.", HttpStatus.BAD_REQUEST);
        }
        if (request.getSeverity() == null) {
            throw new AppException("Issue severity is required.", HttpStatus.BAD_REQUEST);
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

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}
