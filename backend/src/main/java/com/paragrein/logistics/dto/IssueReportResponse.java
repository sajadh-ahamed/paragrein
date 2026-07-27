package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.IssueReport;
import com.paragrein.logistics.enums.IssueSeverity;
import com.paragrein.logistics.enums.IssueStatus;
import com.paragrein.logistics.enums.RoleCode;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class IssueReportResponse {

    private Long id;
    private String title;
    private String description;
    private IssueSeverity severity;
    private IssueStatus issueStatus;
    private String adminResponse;
    private Long reporterUserId;
    private String reporterName;
    private String reporterUsername;
    private RoleCode reporterRole;
    private Long resolvedByUserId;
    private String resolvedByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public IssueReportResponse(IssueReport issueReport) {
        this.id = issueReport.getId();
        this.title = issueReport.getTitle();
        this.description = issueReport.getDescription();
        this.severity = issueReport.getSeverity();
        this.issueStatus = issueReport.getIssueStatus();
        this.adminResponse = issueReport.getAdminResponse();
        this.reporterUserId = issueReport.getReportedByUser().getId();
        this.reporterName = issueReport.getReportedByUser().getFullName();
        this.reporterUsername = issueReport.getReportedByUser().getUsername();
        this.reporterRole = issueReport.getReportedByUser().getRole().getCode();
        this.resolvedByUserId = issueReport.getResolvedByUser() == null ? null : issueReport.getResolvedByUser().getId();
        this.resolvedByUsername = issueReport.getResolvedByUser() == null ? null : issueReport.getResolvedByUser().getUsername();
        this.createdAt = issueReport.getCreatedAt();
        this.resolvedAt = issueReport.getResolvedAt();
    }
}
