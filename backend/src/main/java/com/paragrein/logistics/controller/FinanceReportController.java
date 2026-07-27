package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.OutstandingBalanceReportResponse;
import com.paragrein.logistics.dto.ReportRowResponse;
import com.paragrein.logistics.dto.RevenueReportResponse;
import com.paragrein.logistics.service.ReportService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/finance/reports")
public class FinanceReportController {

    private final ReportService reportService;

    public FinanceReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/revenue")
    public RevenueReportResponse getRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return reportService.getRevenueReport(dateFrom, dateTo, authentication);
    }

    @GetMapping("/outstanding-balances")
    public List<OutstandingBalanceReportResponse> getOutstandingBalances(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return reportService.getOutstandingBalances(dateFrom, dateTo, authentication);
    }

    @GetMapping("/advance-payments")
    public List<ReportRowResponse> getAdvancePayments(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return reportService.getAdvancePayments(dateFrom, dateTo, authentication);
    }

    @GetMapping("/settled-orders")
    public List<ReportRowResponse> getSettledOrders(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return reportService.getSettledOrders(dateFrom, dateTo, authentication);
    }

    @GetMapping("/revenue/export-csv")
    public ResponseEntity<String> exportRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return csv("finance-revenue.csv", reportService.exportRevenueCsv(dateFrom, dateTo, authentication));
    }

    @GetMapping("/outstanding-balances/export-csv")
    public ResponseEntity<String> exportOutstandingBalances(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return csv("outstanding-balances.csv", reportService.exportOutstandingBalancesCsv(dateFrom, dateTo, authentication));
    }

    private ResponseEntity<String> csv(String fileName, String content) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(content);
    }
}
