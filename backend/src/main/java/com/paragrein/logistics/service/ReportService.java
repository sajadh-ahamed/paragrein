package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.CompletedDeliveryReportResponse;
import com.paragrein.logistics.dto.DailyReportResponse;
import com.paragrein.logistics.dto.EmployeeWorkloadReportResponse;
import com.paragrein.logistics.dto.MonthlyReportResponse;
import com.paragrein.logistics.dto.OutstandingBalanceReportResponse;
import com.paragrein.logistics.dto.ReportRowResponse;
import com.paragrein.logistics.dto.ReportSummaryResponse;
import com.paragrein.logistics.dto.RejectedOrderReportResponse;
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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
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

    public ReportService(
            OrderRepository orderRepository,
            PaymentRepository paymentRepository,
            DeliveryConfirmationRepository deliveryConfirmationRepository,
            WarehouseRecordRepository warehouseRecordRepository,
            EmployeeProfileRepository employeeProfileRepository,
            AssignmentRepository assignmentRepository,
            AuditLogRepository auditLogRepository
    ) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.deliveryConfirmationRepository = deliveryConfirmationRepository;
        this.warehouseRecordRepository = warehouseRecordRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.assignmentRepository = assignmentRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public ReportSummaryResponse getAdminSummary(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        List<Order> orders = filterOrdersByCreatedDate(orderRepository.findAll(), dateFrom, dateTo);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed admin summary report.");
        return buildSummary(orders);
    }

    @Transactional
    public DailyReportResponse getDailyReport(LocalDate date, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        LocalDate reportDate = date == null ? LocalDate.now() : date;
        List<Order> dayOrders = filterOrdersByCreatedDate(orderRepository.findAll(), reportDate, reportDate);
        List<DeliveryConfirmation> deliveries = filterDeliveriesByDeliveredDate(deliveryConfirmationRepository.findAll(), reportDate, reportDate);
        BigDecimal revenue = sumVerifiedPayments(reportDate, reportDate);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed daily report for " + reportDate + ".");
        return new DailyReportResponse(reportDate, buildSummary(dayOrders), dayOrders.size(), deliveries.size(), revenue);
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
        List<DeliveryConfirmation> deliveries = filterDeliveriesByDeliveredDate(deliveryConfirmationRepository.findAll(), start, end);
        BigDecimal revenue = sumVerifiedPayments(start, end);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed monthly report for " + reportMonth + ".");
        return new MonthlyReportResponse(reportMonth, buildSummary(monthOrders), monthOrders.size(), deliveries.size(), revenue);
    }

    @Transactional
    public List<CompletedDeliveryReportResponse> getCompletedDeliveries(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed completed delivery report.");
        return completedDeliveryRows(dateFrom, dateTo);
    }

    @Transactional
    public List<WarehouseReportResponse> getWarehouseReport(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed warehouse report.");
        return warehouseRows(dateFrom, dateTo);
    }

    @Transactional
    public List<EmployeeWorkloadReportResponse> getEmployeeWorkload(String role, Long employeeId, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed employee workload report.");
        return employeeWorkloadRows(role, employeeId);
    }

    @Transactional
    public List<RejectedOrderReportResponse> getRejectedOrders(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed rejected and cancelled orders report.");
        return rejectedOrderRows(dateFrom, dateTo);
    }

    @Transactional
    public RevenueReportResponse getRevenueReport(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed finance revenue report.");
        return buildRevenueReport(dateFrom, dateTo);
    }

    @Transactional
    public List<OutstandingBalanceReportResponse> getOutstandingBalances(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed outstanding balance report.");
        return outstandingBalanceRows(dateFrom, dateTo);
    }

    @Transactional
    public List<ReportRowResponse> getAdvancePayments(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed advance payment report.");
        return paymentRows(PaymentType.ADVANCE, dateFrom, dateTo);
    }

    @Transactional
    public List<ReportRowResponse> getSettledOrders(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_VIEWED", "Report", null, "Viewed settled orders report.");
        return deliveryConfirmationRepository.findAll().stream()
                .filter(confirmation -> confirmation.getOrder().getFinancialStatus() == FinancialStatus.FULLY_SETTLED)
                .filter(confirmation -> inDateRange(confirmation.getDeliveredAt(), dateFrom, dateTo))
                .sorted(Comparator.comparing(DeliveryConfirmation::getDeliveredAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(confirmation -> new ReportRowResponse(
                        confirmation.getOrder().getTrackingNumber(),
                        confirmation.getOrder().getCustomer().getFullName(),
                        "DELIVERED",
                        confirmation.getOrder().getTotalAmount(),
                        confirmation.getOrder().getFinancialStatus().name(),
                        confirmation.getOrder().getCreatedAt(),
                        confirmation.getDeliveredAt()
                ))
                .toList();
    }

    @Transactional
    public String exportCompletedDeliveriesCsv(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported completed delivery CSV.");
        return toCsv(
                List.of("Tracking Number", "Customer", "Receiver", "Driver", "Delivered At", "Total Amount", "Advance Amount", "Balance Collected", "Financial Status"),
                completedDeliveryRows(dateFrom, dateTo).stream()
                        .map(row -> List.of(row.getTrackingNumber(), row.getCustomerName(), row.getReceiverName(), row.getDriverName(), text(row.getDeliveredAt()), text(row.getTotalAmount()), text(row.getAdvanceAmount()), text(row.getBalanceCollected()), text(row.getFinancialStatus())))
                        .toList()
        );
    }

    @Transactional
    public String exportWarehouseCsv(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported warehouse CSV.");
        return toCsv(
                List.of("Tracking Number", "Parcel", "Condition", "Zone", "Rack", "Received By", "Received At", "Ready For Dispatch At", "Order Status"),
                warehouseRows(dateFrom, dateTo).stream()
                        .map(row -> List.of(row.getTrackingNumber(), row.getParcelDescription(), row.getParcelCondition(), row.getStorageZone(), row.getStorageRack(), row.getReceivedBy(), text(row.getReceivedAt()), text(row.getReadyForDispatchAt()), text(row.getOrderStatus())))
                        .toList()
        );
    }

    @Transactional
    public String exportEmployeeWorkloadCsv(String role, Long employeeId, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported employee workload CSV.");
        return toCsv(
                List.of("Employee Name", "Role", "Employee Number", "Assigned Count", "Accepted Count", "Completed Count", "Availability"),
                employeeWorkloadRows(role, employeeId).stream()
                        .map(row -> List.of(row.getEmployeeName(), text(row.getRole()), row.getEmployeeNumber(), text(row.getAssignedCount()), text(row.getAcceptedCount()), text(row.getCompletedCount()), text(row.getCurrentAvailability())))
                        .toList()
        );
    }

    @Transactional
    public String exportRevenueCsv(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported revenue CSV.");
        RevenueReportResponse report = buildRevenueReport(dateFrom, dateTo);
        return toCsv(
                List.of("Tracking Number", "Customer", "Reference", "Amount", "Status", "Created At", "Completed At"),
                report.getRows().stream()
                        .map(row -> List.of(row.getTrackingNumber(), row.getCustomerName(), row.getReference(), text(row.getAmount()), row.getStatus(), text(row.getCreatedAt()), text(row.getCompletedAt())))
                        .toList()
        );
    }

    @Transactional
    public String exportOutstandingBalancesCsv(LocalDate dateFrom, LocalDate dateTo, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        validateDateRange(dateFrom, dateTo);
        saveAudit(user, "REPORT_EXPORTED", "Report", null, "Exported outstanding balance CSV.");
        return toCsv(
                List.of("Tracking Number", "Customer", "Total Amount", "Advance Amount", "Balance Amount", "Financial Status", "Order Status"),
                outstandingBalanceRows(dateFrom, dateTo).stream()
                        .map(row -> List.of(row.getTrackingNumber(), row.getCustomerName(), text(row.getTotalAmount()), text(row.getAdvanceAmount()), text(row.getBalanceAmount()), text(row.getFinancialStatus()), text(row.getOrderStatus())))
                        .toList()
        );
    }

    private ReportSummaryResponse buildSummary(List<Order> orders) {
        return new ReportSummaryResponse(
                orders.size(),
                countOrders(orders, OrderStatus.PENDING_ADVANCE_VERIFICATION),
                orders.stream().filter(order -> List.of(OrderStatus.ASSIGNED_TO_PICKUP, OrderStatus.PICKUP_ACCEPTED, OrderStatus.IN_TRANSIT_TO_WAREHOUSE).contains(order.getOrderStatus())).count(),
                orders.stream().filter(order -> List.of(OrderStatus.ARRIVED_AT_WAREHOUSE, OrderStatus.WAREHOUSE_PROCESSING).contains(order.getOrderStatus())).count(),
                countOrders(orders, OrderStatus.READY_FOR_DISPATCH),
                orders.stream().filter(order -> List.of(OrderStatus.ASSIGNED_TO_DELIVERY, OrderStatus.DELIVERY_ACCEPTED, OrderStatus.REACHED_DESTINATION).contains(order.getOrderStatus())).count(),
                countOrders(orders, OrderStatus.DELIVERED),
                orders.stream().filter(order -> List.of(OrderStatus.REJECTED, OrderStatus.CANCELLED).contains(order.getOrderStatus())).count()
        );
    }

    private RevenueReportResponse buildRevenueReport(LocalDate dateFrom, LocalDate dateTo) {
        List<Payment> verifiedPayments = paymentRepository.findAll().stream()
                .filter(payment -> payment.getPaymentStatus() == PaymentStatus.VERIFIED)
                .filter(payment -> inDateRange(payment.getVerifiedAt() == null ? payment.getCreatedAt() : payment.getVerifiedAt(), dateFrom, dateTo))
                .toList();
        BigDecimal totalAdvance = sumPayments(verifiedPayments, PaymentType.ADVANCE);
        BigDecimal totalBalance = sumPayments(verifiedPayments, PaymentType.BALANCE);
        BigDecimal outstanding = outstandingBalanceRows(dateFrom, dateTo).stream()
                .map(OutstandingBalanceReportResponse::getBalanceAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long verifiedAdvanceCount = verifiedPayments.stream().filter(payment -> payment.getPaymentType() == PaymentType.ADVANCE).count();
        long fullySettledCount = orderRepository.findAll().stream()
                .filter(order -> order.getFinancialStatus() == FinancialStatus.FULLY_SETTLED)
                .filter(order -> inDateRange(order.getUpdatedAt(), dateFrom, dateTo))
                .count();
        List<ReportRowResponse> rows = verifiedPayments.stream()
                .sorted(Comparator.comparing((Payment payment) -> Optional.ofNullable(payment.getVerifiedAt()).orElse(payment.getCreatedAt())).reversed())
                .map(payment -> new ReportRowResponse(
                        payment.getOrder().getTrackingNumber(),
                        payment.getOrder().getCustomer().getFullName(),
                        payment.getPaymentReference(),
                        payment.getAmount(),
                        payment.getPaymentType() + " " + payment.getPaymentStatus(),
                        payment.getCreatedAt(),
                        payment.getVerifiedAt()
                ))
                .toList();
        return new RevenueReportResponse(totalAdvance, totalBalance, totalAdvance.add(totalBalance), outstanding, verifiedAdvanceCount, fullySettledCount, rows);
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
                .filter(profile -> role == null || role.isBlank() || profile.getUser().getRole().getCode().name().equalsIgnoreCase(role.trim()))
                .map(profile -> new EmployeeWorkloadReportResponse(
                        profile,
                        assignments.stream().filter(assignment -> assignment.getAssignedToUser().getId().equals(profile.getUser().getId()) && assignment.getAssignmentStatus() == AssignmentStatus.ASSIGNED).count(),
                        assignments.stream().filter(assignment -> assignment.getAssignedToUser().getId().equals(profile.getUser().getId()) && assignment.getAssignmentStatus() == AssignmentStatus.ACCEPTED).count(),
                        assignments.stream().filter(assignment -> assignment.getAssignedToUser().getId().equals(profile.getUser().getId()) && assignment.getAssignmentStatus() == AssignmentStatus.COMPLETED).count()
                ))
                .toList();
    }

    private List<RejectedOrderReportResponse> rejectedOrderRows(LocalDate dateFrom, LocalDate dateTo) {
        List<Payment> rejectedPayments = paymentRepository.findAll().stream()
                .filter(payment -> payment.getPaymentStatus() == PaymentStatus.REJECTED)
                .toList();
        return filterOrdersByCreatedDate(orderRepository.findAll(), dateFrom, dateTo).stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.REJECTED || order.getOrderStatus() == OrderStatus.CANCELLED || order.getFinancialStatus() == FinancialStatus.ADVANCE_REJECTED)
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .map(order -> new RejectedOrderReportResponse(
                        order,
                        rejectedPayments.stream().filter(payment -> payment.getOrder().getId().equals(order.getId())).findFirst().orElse(null)
                ))
                .toList();
    }

    private List<OutstandingBalanceReportResponse> outstandingBalanceRows(LocalDate dateFrom, LocalDate dateTo) {
        return filterOrdersByCreatedDate(orderRepository.findAll(), dateFrom, dateTo).stream()
                .filter(order -> order.getFinancialStatus() == FinancialStatus.ADVANCE_VERIFIED || order.getFinancialStatus() == FinancialStatus.BALANCE_DUE)
                .filter(order -> order.getBalanceAmount().compareTo(BigDecimal.ZERO) > 0)
                .sorted(Comparator.comparing(Order::getUpdatedAt).reversed())
                .map(OutstandingBalanceReportResponse::new)
                .toList();
    }

    private List<ReportRowResponse> paymentRows(PaymentType type, LocalDate dateFrom, LocalDate dateTo) {
        return paymentRepository.findAll().stream()
                .filter(payment -> payment.getPaymentType() == type)
                .filter(payment -> inDateRange(payment.getCreatedAt(), dateFrom, dateTo))
                .sorted(Comparator.comparing(Payment::getCreatedAt).reversed())
                .map(payment -> new ReportRowResponse(
                        payment.getOrder().getTrackingNumber(),
                        payment.getOrder().getCustomer().getFullName(),
                        payment.getPaymentReference(),
                        payment.getAmount(),
                        payment.getPaymentStatus().name(),
                        payment.getCreatedAt(),
                        payment.getVerifiedAt()
                ))
                .toList();
    }

    private List<Order> filterOrdersByCreatedDate(List<Order> orders, LocalDate dateFrom, LocalDate dateTo) {
        return orders.stream()
                .filter(order -> inDateRange(order.getCreatedAt(), dateFrom, dateTo))
                .toList();
    }

    private List<DeliveryConfirmation> filterDeliveriesByDeliveredDate(List<DeliveryConfirmation> deliveries, LocalDate dateFrom, LocalDate dateTo) {
        return deliveries.stream()
                .filter(confirmation -> inDateRange(confirmation.getDeliveredAt(), dateFrom, dateTo))
                .toList();
    }

    private BigDecimal sumVerifiedPayments(LocalDate dateFrom, LocalDate dateTo) {
        return paymentRepository.findAll().stream()
                .filter(payment -> payment.getPaymentStatus() == PaymentStatus.VERIFIED)
                .filter(payment -> inDateRange(payment.getVerifiedAt() == null ? payment.getCreatedAt() : payment.getVerifiedAt(), dateFrom, dateTo))
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
        // Validation rule: reports reject inverted date ranges before calculating or exporting rows.
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
}
