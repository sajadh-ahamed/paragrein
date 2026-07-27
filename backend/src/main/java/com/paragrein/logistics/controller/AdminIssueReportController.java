package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.AdminIssueResponseRequest;
import com.paragrein.logistics.dto.IssueReportResponse;
import com.paragrein.logistics.dto.IssueStatusUpdateRequest;
import com.paragrein.logistics.service.IssueReportService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/issues")
public class AdminIssueReportController {

    private final IssueReportService issueReportService;

    public AdminIssueReportController(IssueReportService issueReportService) {
        this.issueReportService = issueReportService;
    }

    @GetMapping
    public List<IssueReportResponse> getAllIssues() {
        return issueReportService.getAllIssueReportsForAdmin();
    }

    @GetMapping("/{issueId}")
    public IssueReportResponse getIssueDetail(@PathVariable Long issueId) {
        return issueReportService.getAdminIssueDetail(issueId);
    }

    @PatchMapping("/{issueId}/status")
    public IssueReportResponse updateIssueStatus(
            @PathVariable Long issueId,
            @RequestBody IssueStatusUpdateRequest request,
            Authentication authentication
    ) {
        return issueReportService.updateIssueStatus(issueId, request, authentication);
    }

    @PatchMapping("/{issueId}/respond")
    public IssueReportResponse respondToIssue(
            @PathVariable Long issueId,
            @RequestBody AdminIssueResponseRequest request,
            Authentication authentication
    ) {
        return issueReportService.respondToIssue(issueId, request, authentication);
    }

    @PatchMapping("/{issueId}/close")
    public IssueReportResponse closeIssue(@PathVariable Long issueId, Authentication authentication) {
        return issueReportService.closeIssue(issueId, authentication);
    }
}
