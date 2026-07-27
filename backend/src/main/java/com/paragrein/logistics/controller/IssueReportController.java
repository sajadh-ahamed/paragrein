package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.IssueReportRequest;
import com.paragrein.logistics.dto.IssueReportResponse;
import com.paragrein.logistics.service.IssueReportService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/issues")
public class IssueReportController {

    private final IssueReportService issueReportService;

    public IssueReportController(IssueReportService issueReportService) {
        this.issueReportService = issueReportService;
    }

    @PostMapping
    public IssueReportResponse createIssue(@RequestBody IssueReportRequest request, Authentication authentication) {
        return issueReportService.createIssueReport(request, authentication);
    }

    @GetMapping("/my")
    public List<IssueReportResponse> getMyIssues(Authentication authentication) {
        return issueReportService.getMyIssueReports(authentication);
    }

    @GetMapping("/my/{issueId}")
    public IssueReportResponse getMyIssueDetail(@PathVariable Long issueId, Authentication authentication) {
        return issueReportService.getIssueDetail(issueId, authentication);
    }
}
