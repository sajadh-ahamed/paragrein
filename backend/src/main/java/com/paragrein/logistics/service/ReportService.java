package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.CompletedDeliveryReportResponse;
import com.paragrein.logistics.dto.DailyReportResponse;
import com.paragrein.logistics.dto.EmployeeWorkloadReportResponse;
import com.paragrein.logistics.dto.MonthlyReportResponse;
import com.paragrein.logistics.dto.OutstandingBalanceReportResponse;
import com.paragrein.logistics.dto.ReportSummaryResponse;
import com.paragrein.logistics.dto.RevenueReportResponse;
import com.paragrein.logistics.dto.WarehouseReportResponse;
import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.DeliveryConfirmation;
import com.paragrein.logistics.entity.EmployeeProfile;
import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.Payment;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.entity.WarehouseRecord;
import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import com.paragrein.logistics.enums.PaymentStatus;
import com.paragrein.logistics.enums.PaymentType;
import com.paragrein.logistics.enums.RoleCode;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AssignmentRepository;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.DeliveryConfirmationRepository;
import com.paragrein.logistics.repository.EmployeeProfileRepository;
import com.paragrein.logistics.repository.OrderRepository;
import com.paragrein.logistics.repository.PaymentRepository;
import com.paragrein.logistics.repository.WarehouseRecordRepository;
import com.paragrein.logistics.security.SecurityUserUtil;
import com.paragrein.logistics.util.CurrencyFormatter;
import com.paragrein.logistics.util.PdfReportGenerator;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final DeliveryConfirmationRepository deliveryConfirmationRepository;
    private final WarehouseRecordRepository warehouseRecordRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final AssignmentRepository assignmentRepository;
    private final AuditLogRepository auditLogRepository;
    private final PdfGenerationService pdfGenerationService;

    public ReportService(
            OrderRepository orderRepository,
            PaymentRepository paymentRepository,
            DeliveryConfirmationRepository deliveryConfirmationRepository,
            WarehouseRecordRepository warehouseRecordRepository,
            EmployeeProfileRepository employeeProfileRepository,
            AssignmentRepository assignmentRepository,
            AuditLogRepository auditLogRepository,
            PdfGenerationService pdfGenerationService) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.deliveryConfirmationRepository = deliveryConfirmationRepository;
        this.warehouseRecordRepository = warehouseRecordRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.assignmentRepository = assignmentRepository;
        this.auditLogRepository = auditLogRepository;
        this.pdfGenerationService = pdfGenerationService;
    }

    @Transactional
    public DailyReportResponse getDailyReport(LocalDate date, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        LocalDate reportDate = date == null ? LocalDate.now() : date;
        List<Order> dayOrders = filterOrdersByCreatedDate(orderRepository.findAll(), reportDate, reportDate);
        List<DeliveryConfirmation> deliveries = filterDeliveriesByDeliveredDate(
                deliveryConfirmationRepository.findAll(), reportDate, reportDate);
        BigDecimal revenue = sumVerifiedPayments(reportDate, reportDate);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed daily report for " + reportDate + ".");
        return new DailyReportResponse(reportDate, buildSummary(dayOrders), dayOrders.size(), deliveries.size(),
                revenue);
    }

    @Transactional
    public MonthlyReportResponse getMonthlyReport(Integer year, Integer month, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        if (month != null && (month < 1 || month > 12)) {
            throw new AppException("Month must be between 1 and 12.", HttpStatus.BAD_REQUEST);
        }
        YearMonth reportMonth = year == null || month == null ? YearMonth.now() : YearMonth.of(year, month);
        LocalDate start = reportMonth.atDay(1);
        LocalDate end = reportMonth.atEndOfMonth();
        List<Order> monthOrders = filterOrdersByCreatedDate(orderRepository.findAll(), start, end);
        List<DeliveryConfirmation> deliveries = filterDeliveriesByDeliveredDate(
                deliveryConfirmationRepository.findAll(), start, end);
        BigDecimal revenue = sumVerifiedPayments(start, end);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed monthly report for " + reportMonth + ".");
        return new MonthlyReportResponse(reportMonth, buildSummary(monthOrders), monthOrders.size(), deliveries.size(),
                revenue);
    }

    @Transactional
    public List<CompletedDeliveryReportResponse> getCompletedDeliveries(LocalDate dateFrom, LocalDate dateTo,
            Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed completed delivery report.");
        return completedDeliveryRows(dateFrom, dateTo);
    }

    @Transactional
    public List<WarehouseReportResponse> getWarehouseReport(LocalDate dateFrom, LocalDate dateTo,
            Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed warehouse report.");
        return warehouseRows(dateFrom, dateTo);
    }

    @Transactional
    public List<EmployeeWorkloadReportResponse> getEmployeeWorkload(String role, Long employeeId,
            Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed employee workload report.");
        return employeeWorkloadRows(role, employeeId);
    }

    @Transactional
    public RevenueReportResponse getRevenueReport(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed finance revenue report.");
        return buildRevenueReport(dateFrom, dateTo);
    }

    @Transactional
    public List<OutstandingBalanceReportResponse> getOutstandingBalances(LocalDate dateFrom, LocalDate dateTo,
            Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed outstanding balance report.");
        return outstandingBalanceRows(dateFrom, dateTo);
    }

    @Transactional
    public String exportCompletedDeliveriesCsv(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported completed delivery CSV.");
        return toCsv(
                List.of("Tracking Number", "Customer", "Receiver", "Driver", "Delivered At", "Total Amount",
                        "Advance Amount", "Balance Collected", "Financial Status"),
                completedDeliveryRows(dateFrom, dateTo).stream()
                        .map(row -> List.of(row.getTrackingNumber(), row.getCustomerName(), row.getReceiverName(),
                                row.getDriverName(), text(row.getDeliveredAt()), text(row.getTotalAmount()),
                                text(row.getAdvanceAmount()), text(row.getBalanceCollected()),
                                text(row.getFinancialStatus())))
                        .toList());
    }

    @Transactional
    public String exportWarehouseCsv(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported warehouse CSV.");
        return toCsv(
                List.of("Tracking Number", "Parcel", "Condition", "Zone", "Rack", "Received By", "Received At",
                        "Ready For Dispatch At", "Order Status"),
                warehouseRows(dateFrom, dateTo).stream()
                        .map(row -> List.of(row.getTrackingNumber(), row.getParcelDescription(),
                                row.getParcelCondition(), row.getStorageZone(), row.getStorageRack(),
                                row.getReceivedBy(), text(row.getReceivedAt()), text(row.getReadyForDispatchAt()),
                                text(row.getOrderStatus())))
                        .toList());
    }

    @Transactional
    public String exportEmployeeWorkloadCsv(String role, Long employeeId, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported employee workload CSV.");
        return toCsv(
                List.of("Employee Name", "Role", "Employee Number", "Assigned Count", "Accepted Count",
                        "Completed Count", "Availability"),
                employeeWorkloadRows(role, employeeId).stream()
                        .map(row -> List.of(row.getEmployeeName(), text(row.getRole()), row.getEmployeeNumber(),
                                text(row.getAssignedCount()), text(row.getAcceptedCount()),
                                text(row.getCompletedCount()), text(row.getCurrentAvailability())))
                        .toList());
    }

    @Transactional
    public String exportRevenueCsv(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported outstanding balance CSV.");
        return toCsv(
                List.of("Tracking Number", "Customer", "Total Amount", "Advance Amount", "Balance Amount",
                        "Financial Status", "Order Status"),
                outstandingBalanceRows(dateFrom, dateTo).stream()
                        .map(row -> List.of(row.getTrackingNumber(), row.getCustomerName(), text(row.getTotalAmount()),
                                text(row.getAdvanceAmount()), text(row.getBalanceAmount()),
                                text(row.getFinancialStatus()), text(row.getOrderStatus())))
                        .toList());
    }

    @Transactional
    public byte[] exportCompletedDeliveriesPdf(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported completed delivery PDF.");

        List<String> headers = List.of(
                "Tracking Number",
                "Customer",
                "Driver",
                "Financial Status");
        List<List<String>> rows = completedDeliveryRows(dateFrom, dateTo).stream()
                .map(row -> List.of(
                        row.getTrackingNumber(), row.getCustomerName(), row.getDriverName(),
                        text(row.getFinancialStatus())))
                .toList();

        try {
            return new PdfReportGenerator("Completed Deliveries Report", headers, rows, user, dateFrom, dateTo)
                    .generate();
        } catch (IOException e) {
            throw new AppException("Failed to generate PDF report.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public byte[] exportEmployeeWorkloadPdf(String role, Long employeeId, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported employee workload PDF.");

        List<String> headers = List.of("Employee Name", "Role", "Employee Number", "Assigned", "Accepted", "Completed",
                "Availability");
        List<List<String>> rows = employeeWorkloadRows(role, employeeId).stream()
                .map(row -> List.of(row.getEmployeeName(), text(row.getRole()), row.getEmployeeNumber(),
                        text(row.getAssignedCount()), text(row.getAcceptedCount()), text(row.getCompletedCount()),
                        text(row.getCurrentAvailability())))
                .toList();

        try {
            // For employee workload, the date range is not applicable, so passing nulls.
            return new PdfReportGenerator("Employee Performance Report", headers, rows, user, null, null).generate();
        } catch (IOException e) {
            throw new AppException("Failed to generate PDF report.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private ReportSummaryResponse buildSummary(List<Order> orders) {
        return new ReportSummaryResponse(
                orders.size(),
                countOrders(orders, OrderStatus.PENDING_ADVANCE_VERIFICATION),
                orders.stream()
                        .filter(order -> List.of(OrderStatus.ASSIGNED_TO_PICKUP, OrderStatus.PICKUP_ACCEPTED,
                                OrderStatus.IN_TRANSIT_TO_WAREHOUSE).contains(order.getOrderStatus()))
                        .count(),
                orders.stream()
                        .filter(order -> List.of(OrderStatus.ARRIVED_AT_WAREHOUSE, OrderStatus.WAREHOUSE_PROCESSING)
                                .contains(order.getOrderStatus()))
                        .count(),
                countOrders(orders, OrderStatus.READY_FOR_DISPATCH),
                orders.stream()
                        .filter(order -> List.of(OrderStatus.ASSIGNED_TO_DELIVERY, OrderStatus.DELIVERY_ACCEPTED,
                                OrderStatus.REACHED_DESTINATION).contains(order.getOrderStatus()))
                        .count(),
                countOrders(orders, OrderStatus.DELIVERED),
                orders.stream().filter(
                        order -> List.of(OrderStatus.REJECTED, OrderStatus.CANCELLED).contains(order.getOrderStatus()))
                        .count());
    }

    private RevenueReportResponse buildRevenueReport(LocalDate dateFrom, LocalDate dateTo) {
        List<Payment> verifiedPayments = paymentRepository.findVerifiedPaymentsInDateRange(dateFrom, dateTo);
        BigDecimal totalAdvance = sumPayments(verifiedPayments, PaymentType.ADVANCE);
        BigDecimal totalBalance = sumPayments(verifiedPayments, PaymentType.BALANCE);
        return new RevenueReportResponse(
                totalAdvance,
                totalBalance,
                totalAdvance.add(totalBalance));
    }

    private List<CompletedDeliveryReportResponse> completedDeliveryRows(LocalDate dateFrom, LocalDate dateTo) {
        return deliveryConfirmationRepository.findAll().stream()
                .filter(confirmation -> confirmation.getDeliveredAt() != null)
                .filter(confirmation -> inDateRange(confirmation.getDeliveredAt(), dateFrom, dateTo))
                .sorted(Comparator.comparing(DeliveryConfirmation::getDeliveredAt).reversed())
                .map(CompletedDeliveryReportResponse::new)
                .toList();
    }

    private List<WarehouseReportResponse> warehouseRows(LocalDate dateFrom, LocalDate dateTo) {
        return warehouseRecordRepository.findAll().stream()
                .filter(record -> inDateRange(record.getReceivedAt(), dateFrom, dateTo))
                .sorted(Comparator.comparing(WarehouseRecord::getReceivedAt).reversed())
                .map(WarehouseReportResponse::new)
                .toList();
    }

    private List<EmployeeWorkloadReportResponse> employeeWorkloadRows(String role, Long employeeId) {
        List<Assignment> assignments = assignmentRepository.findAllByOrderByAssignedAtDesc();
        return employeeProfileRepository.findAll().stream()
                .filter(profile -> profile.getUser().getRole().getCode() != RoleCode.CUSTOMER)
                .filter(profile -> employeeId == null || profile.getUser().getId().equals(employeeId))
                .filter(profile -> role == null || role.isBlank()
                        || profile.getUser().getRole().getCode().name().equalsIgnoreCase(role.trim()))
                .map(profile -> new EmployeeWorkloadReportResponse(
                        profile,
                        assignments.stream().filter(
                                assignment -> assignment.getAssignedToUser().getId().equals(profile.getUser().getId())
                                        && assignment.getAssignmentStatus() == AssignmentStatus.ASSIGNED)
                                .count(),
                        assignments.stream().filter(
                                assignment -> assignment.getAssignedToUser().getId().equals(profile.getUser().getId())
                                        && assignment.getAssignmentStatus() == AssignmentStatus.ACCEPTED)
                                .count(),
                        assignments.stream().filter(
                                assignment -> assignment.getAssignedToUser().getId().equals(profile.getUser().getId())
                                        && assignment.getAssignmentStatus() == AssignmentStatus.COMPLETED)
                                .count()))
                .toList();
    }

    private List<OutstandingBalanceReportResponse> outstandingBalanceRows(LocalDate dateFrom, LocalDate dateTo) {
        return filterOrdersByCreatedDate(orderRepository.findAll(), dateFrom, dateTo).stream()
                .filter(order -> order.getFinancialStatus() == FinancialStatus.ADVANCE_VERIFIED
                        || order.getFinancialStatus() == FinancialStatus.BALANCE_DUE)
                .filter(order -> order.getBalanceAmount().compareTo(BigDecimal.ZERO) > 0)
                .sorted(Comparator.comparing(Order::getUpdatedAt).reversed())
                .map(OutstandingBalanceReportResponse::new)
                .toList();
    }

    private List<Order> filterOrdersByCreatedDate(List<Order> orders, LocalDate dateFrom, LocalDate dateTo) {
        return orders.stream()
                .filter(order -> inDateRange(order.getCreatedAt(), dateFrom, dateTo))
                .toList();
    }

    private List<DeliveryConfirmation> filterDeliveriesByDeliveredDate(List<DeliveryConfirmation> deliveries,
            LocalDate dateFrom, LocalDate dateTo) {
        return deliveries.stream()
                .filter(confirmation -> inDateRange(confirmation.getDeliveredAt(), dateFrom, dateTo))
                .toList();
    }

    private BigDecimal sumVerifiedPayments(LocalDate dateFrom, LocalDate dateTo) {
        return paymentRepository.findAll().stream()
                .filter(payment -> payment.getPaymentStatus() == PaymentStatus.VERIFIED)
                .filter(payment -> inDateRange(
                        payment.getVerifiedAt() == null ? payment.getCreatedAt() : payment.getVerifiedAt(), dateFrom,
                        dateTo))
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumPayments(List<Payment> payments, PaymentType type) {
        return payments.stream()
                .filter(payment -> payment.getPaymentType() == type)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private long countOrders(List<Order> orders, OrderStatus status) {
        return orders.stream().filter(order -> order.getOrderStatus() == status).count();
    }

    private boolean inDateRange(LocalDateTime value, LocalDate dateFrom, LocalDate dateTo) {
        if (value == null) {
            return false;
        }
        LocalDate date = value.toLocalDate();
        if (dateFrom != null && date.isBefore(dateFrom)) {
            return false;
        }
        return dateTo == null || !date.isAfter(dateTo);
    }

    private void validateDateRange(LocalDate dateFrom, LocalDate dateTo) {
        // Validation rule: reports reject inverted date ranges before calculating or
        // exporting rows.
        if (dateFrom != null && dateTo != null && dateFrom.isAfter(dateTo)) {
            throw new AppException("Date from must be before or equal to date to.", HttpStatus.BAD_REQUEST);
        }
    }

    private String toCsv(List<String> headers, List<List<String>> rows) {
        StringBuilder builder = new StringBuilder();
        builder.append(csvLine(headers));
        rows.forEach(row -> builder.append(csvLine(row)));
        return builder.toString();
    }

    private String csvLine(List<String> values) {
        return values.stream()
                .map(this::escapeCsv)
                .reduce((left, right) -> left + "," + right)
                .orElse("")
                + "\n";
    }

    private String escapeCsv(String value) {
        String text = value == null ? "" : value;
        if (text.contains(",") || text.contains("\"") || text.contains("\n")) {
            return "\"" + text.replace("\"", "\"\"") + "\"";
        }
        return text;
    }

    private String text(Object value) {
        return value == null ? "" : String.valueOf(value);
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

    @Transactional
    public byte[] exportFinancialSummaryPdf(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported financial summary PDF.");

        RevenueReportResponse reportData = buildRevenueReport(dateFrom, dateTo);

        var filters = new LinkedHashMap<String, String>();
        filters.put("Generated By", user.getFullName());
        filters.put("Generated On", text(LocalDateTime.now()));
        filters.put("Report Period", (dateFrom != null && dateTo != null) ? dateFrom + " to " + dateTo : "All Records");

        var data = new LinkedHashMap<String, String>();
        data.put("Advance Received", CurrencyFormatter.format(reportData.getTotalAdvance()));
        data.put("Balance Collected", CurrencyFormatter.format(reportData.getTotalBalance()));
        data.put("Total Revenue", CurrencyFormatter.format(reportData.getTotalRevenue()));
        return pdfGenerationService.generateSummaryReportPdf("Financial Summary Report", filters, data);
    }

    @Transactional
    public byte[] exportDailySummaryPdf(LocalDate date, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        LocalDate reportDate = date == null ? LocalDate.now() : date;
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported daily summary PDF for " + reportDate + ".");

        DailyReportResponse reportData = getDailyReport(reportDate, authentication);

        var filters = new LinkedHashMap<String, String>();
        filters.put("Generated By", user.getFullName());
        filters.put("Generated On", text(LocalDateTime.now()));
        filters.put("Report Date", reportDate.toString());

        var data = new LinkedHashMap<String, String>();
        data.put("Rejected/Cancelled", text(reportData.getSummary().getRejectedOrders()));
        data.put("Orders at Warehouse", text(reportData.getSummary().getWarehouseOrders()));
        data.put("Orders Created", text(reportData.getOrdersCreated()));
        data.put("Orders Delivered", text(reportData.getOrdersDelivered()));
        data.put("Revenue Collected", CurrencyFormatter.format(reportData.getRevenueCollected()));

        return pdfGenerationService.generateSummaryReportPdf("Daily Summary Report", filters, data);
    }

    @Transactional
    public byte[] exportMonthlySummaryPdf(Integer year, Integer month, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        YearMonth reportMonth = year == null || month == null ? YearMonth.now() : YearMonth.of(year, month);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported monthly summary PDF for " + reportMonth + ".");

        MonthlyReportResponse reportData = getMonthlyReport(year, month, authentication);

        var filters = new LinkedHashMap<String, String>();
        filters.put("Generated By", user.getFullName());
        filters.put("Generated On", text(LocalDateTime.now()));
        filters.put("Report Month", reportMonth.toString());

        var data = new LinkedHashMap<String, String>();
        data.put("Orders Created", text(reportData.getOrdersCreated()));
        data.put("Orders Delivered", text(reportData.getOrdersDelivered()));
        data.put("Revenue Collected", CurrencyFormatter.format(reportData.getRevenueCollected()));
        data.put("Total Orders in Month", text(reportData.getSummary().getTotalOrders()));
        data.put("Delivered in Month", text(reportData.getSummary().getDeliveredOrders()));

        return pdfGenerationService.generateSummaryReportPdf("Monthly Summary Report", filters, data);
    }
}
