package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.CompletedDeliveryReportResponse;
import com.paragrein.logistics.dto.DailyReportResponse;
import com.paragrein.logistics.dto.EmployeeWorkloadReportResponse;
import com.paragrein.logistics.dto.MonthlyReportResponse;
import com.paragrein.logistics.dto.ReportSummaryResponse;
import com.paragrein.logistics.dto.RejectedOrderReportResponse;
import com.paragrein.logistics.dto.WarehouseReportResponse;
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
@RequestMapping("/api/admin/reports")
public class AdminReportController {

    private final ReportService reportService;

    public AdminReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    public ReportSummaryResponse getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return reportService.getAdminSummary(dateFrom, dateTo, authentication);
    }

    @GetMapping("/daily")
    public DailyReportResponse getDaily(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication
    ) {
        return reportService.getDailyReport(date, authentication);
    }

    @GetMapping("/monthly")
    public MonthlyReportResponse getMonthly(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            Authentication authentication
    ) {
        return reportService.getMonthlyReport(year, month, authentication);
    }

    @GetMapping("/completed-deliveries")
    public List<CompletedDeliveryReportResponse> getCompletedDeliveries(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return reportService.getCompletedDeliveries(dateFrom, dateTo, authentication);
    }

    @GetMapping("/warehouse")
    public List<WarehouseReportResponse> getWarehouseReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return reportService.getWarehouseReport(dateFrom, dateTo, authentication);
    }

    @GetMapping("/employee-workload")
    public List<EmployeeWorkloadReportResponse> getEmployeeWorkload(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Long employeeId,
            Authentication authentication
    ) {
        return reportService.getEmployeeWorkload(role, employeeId, authentication);
    }

    @GetMapping("/rejected-orders")
    public List<RejectedOrderReportResponse> getRejectedOrders(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return reportService.getRejectedOrders(dateFrom, dateTo, authentication);
    }

    @GetMapping("/completed-deliveries/export-csv")
    public ResponseEntity<String> exportCompletedDeliveries(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return csv("completed-deliveries.csv", reportService.exportCompletedDeliveriesCsv(dateFrom, dateTo, authentication));
    }

    @GetMapping("/warehouse/export-csv")
    public ResponseEntity<String> exportWarehouse(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return csv("warehouse-report.csv", reportService.exportWarehouseCsv(dateFrom, dateTo, authentication));
    }

    @GetMapping("/employee-workload/export-csv")
    public ResponseEntity<String> exportEmployeeWorkload(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Long employeeId,
            Authentication authentication
    ) {
        return csv("employee-workload.csv", reportService.exportEmployeeWorkloadCsv(role, employeeId, authentication));
    }

    @GetMapping("/completed-deliveries/export-pdf")
    public ResponseEntity<byte[]> exportCompletedDeliveriesPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Authentication authentication
    ) {
        return pdf("completed-deliveries.pdf", reportService.exportCompletedDeliveriesPdf(dateFrom, dateTo, authentication));
    }

    @GetMapping("/employee-workload/export-pdf")
    public ResponseEntity<byte[]> exportEmployeeWorkloadPdf(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Long employeeId,
            Authentication authentication
    ) {
        return pdf("employee-workload.pdf", reportService.exportEmployeeWorkloadPdf(role, employeeId, authentication));
    }

    private ResponseEntity<String> csv(String fileName, String content) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(content);
    }

    private ResponseEntity<byte[]> pdf(String fileName, byte[] content) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(content);
    }
}
