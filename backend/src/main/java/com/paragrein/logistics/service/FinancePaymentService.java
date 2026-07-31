package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.FinanceDashboardSummaryResponse;
import com.paragrein.logistics.dto.FinancePaymentDetailResponse;
import com.paragrein.logistics.dto.FinancePaymentSummaryResponse;
import com.paragrein.logistics.dto.RejectAdvancePaymentRequest;
import com.paragrein.logistics.dto.VerifyAdvancePaymentRequest;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.Notification;
import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.OrderStatusHistory;
import com.paragrein.logistics.entity.Payment;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.NotificationType;
import com.paragrein.logistics.enums.OrderStatus;
import com.paragrein.logistics.enums.PaymentStatus;
import com.paragrein.logistics.enums.PaymentType;
import com.paragrein.logistics.enums.ReadStatus;
import com.paragrein.logistics.enums.RoleCode;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.NotificationRepository;
import com.paragrein.logistics.repository.OrderRepository;
import com.paragrein.logistics.repository.OrderStatusHistoryRepository;
import com.paragrein.logistics.repository.PaymentRepository;
import com.paragrein.logistics.repository.UserRepository;
import com.paragrein.logistics.security.SecurityUserUtil;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FinancePaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public FinancePaymentService(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            OrderStatusHistoryRepository orderStatusHistoryRepository,
            AuditLogRepository auditLogRepository,
            NotificationRepository notificationRepository,
            UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public FinanceDashboardSummaryResponse getFinanceDashboardSummary() {
        List<Payment> pendingAdvance = findAdvancePayments(PaymentStatus.SUBMITTED);
        List<Payment> verifiedAdvance = findAdvancePayments(PaymentStatus.VERIFIED);
        List<Payment> rejectedAdvance = findAdvancePayments(PaymentStatus.REJECTED);
        List<Order> outstandingOrders = orderRepository.findByFinancialStatusInOrderByUpdatedAtDesc(List.of(
                FinancialStatus.ADVANCE_VERIFIED,
                FinancialStatus.BALANCE_DUE));

        BigDecimal totalVerifiedAdvanceAmount = verifiedAdvance.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalOutstandingBalanceAmount = outstandingOrders.stream()
                .map(Order::getBalanceAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRevenue = paymentRepository.sumTotalByPaymentStatus(PaymentStatus.VERIFIED);

        return new FinanceDashboardSummaryResponse(
                pendingAdvance.size(),
                verifiedAdvance.size(),
                rejectedAdvance.size(),
                totalVerifiedAdvanceAmount,
                totalOutstandingBalanceAmount,
                (long) orderRepository.countByFinancialStatus(FinancialStatus.ADVANCE_SUBMITTED),
                orderRepository.countByFinancialStatusAndOrderStatus(FinancialStatus.ADVANCE_VERIFIED,
                        OrderStatus.PENDING_ADVANCE_VERIFICATION),
                totalRevenue);
    }

    @Transactional(readOnly = true)
    public List<FinancePaymentSummaryResponse> getPendingAdvancePayments() {
        return toSummary(findAdvancePayments(PaymentStatus.SUBMITTED));
    }

    @Transactional(readOnly = true)
    public List<FinancePaymentSummaryResponse> getVerifiedAdvancePayments() {
        return toSummary(findAdvancePayments(PaymentStatus.VERIFIED));
    }

    @Transactional(readOnly = true)
    public List<FinancePaymentSummaryResponse> getRejectedAdvancePayments() {
        return toSummary(findAdvancePayments(PaymentStatus.REJECTED));
    }

    @Transactional(readOnly = true)
    public List<FinancePaymentSummaryResponse> getCompletedPayments() {
        return getVerifiedAdvancePayments();
    }

    @Transactional(readOnly = true)
    public FinancePaymentDetailResponse getPaymentDetail(Long paymentId) {
        return new FinancePaymentDetailResponse(findPayment(paymentId));
    }

    @Transactional(readOnly = true)
    public List<FinancePaymentSummaryResponse> getOutstandingBalances() {
        return orderRepository.findByFinancialStatusInOrderByUpdatedAtDesc(List.of(
                FinancialStatus.ADVANCE_VERIFIED,
                FinancialStatus.BALANCE_DUE)).stream()
                .map(order -> new FinancePaymentSummaryResponse(order, latestPaymentForOrder(order)))
                .toList();
    }

    @Transactional
    public FinancePaymentDetailResponse verifyAdvancePayment(Long paymentId, VerifyAdvancePaymentRequest request,
            Authentication authentication) {
        User financeOfficer = SecurityUserUtil.requireCurrentUser(authentication);
        Payment payment = findPayment(paymentId);
        validateAdvancePaymentCanBeProcessed(payment);

        Order order = payment.getOrder();
        payment.setPaymentStatus(PaymentStatus.VERIFIED);
        payment.setVerifiedByUser(financeOfficer);
        payment.setVerifiedAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);

        order.setFinancialStatus(FinancialStatus.ADVANCE_VERIFIED);
        Order savedOrder = orderRepository.save(order);

        // Business rule: finance approval prepares the order for admin pickup
        // assignment without assigning operations staff.
        saveStatusHistory(
                savedOrder,
                savedOrder.getOrderStatus(),
                savedOrder.getOrderStatus(),
                financeOfficer,
                "Advance payment verified by finance officer. Order is ready for admin pickup assignment.");
        saveAudit(financeOfficer, "ADVANCE_PAYMENT_VERIFIED", "Payment", savedPayment.getId(),
                "Verified advance payment for " + savedOrder.getTrackingNumber());
        createNotification(savedOrder.getCustomer(), "Advance payment verified",
                "Order " + savedOrder.getTrackingNumber() + " is ready for admin pickup assignment.",
                NotificationType.PAYMENT);
        notifyAdmins(savedOrder.getTrackingNumber());

        return new FinancePaymentDetailResponse(savedPayment);
    }

    @Transactional
    public FinancePaymentDetailResponse rejectAdvancePayment(Long paymentId, RejectAdvancePaymentRequest request,
            Authentication authentication) {
        User financeOfficer = SecurityUserUtil.requireCurrentUser(authentication);
        if (request == null || isBlank(request.getRejectionReason())) {
            throw new AppException("Rejection reason is required.", HttpStatus.BAD_REQUEST);
        }

        Payment payment = findPayment(paymentId);
        validateAdvancePaymentCanBeProcessed(payment);

        Order order = payment.getOrder();
        OrderStatus previousStatus = order.getOrderStatus();
        payment.setPaymentStatus(PaymentStatus.REJECTED);
        payment.setVerifiedByUser(financeOfficer);
        payment.setVerifiedAt(LocalDateTime.now());
        payment.setRejectionReason(clean(request.getRejectionReason()));
        Payment savedPayment = paymentRepository.save(payment);

        order.setFinancialStatus(FinancialStatus.ADVANCE_REJECTED);
        order.setOrderStatus(OrderStatus.REJECTED);
        Order savedOrder = orderRepository.save(order);

        saveStatusHistory(savedOrder, previousStatus, OrderStatus.REJECTED, financeOfficer,
                "Advance payment rejected: " + clean(request.getRejectionReason()));
        saveAudit(financeOfficer, "ADVANCE_PAYMENT_REJECTED", "Payment", savedPayment.getId(),
                "Rejected advance payment for " + savedOrder.getTrackingNumber());
        createNotification(savedOrder.getCustomer(), "Advance payment rejected", "Order "
                + savedOrder.getTrackingNumber() + " was rejected. Reason: " + clean(request.getRejectionReason()),
                NotificationType.PAYMENT);

        return new FinancePaymentDetailResponse(savedPayment);
    }

    private void validateAdvancePaymentCanBeProcessed(Payment payment) {
        Order order = payment.getOrder();
        if (payment.getPaymentType() != PaymentType.ADVANCE) {
            throw new AppException("Only advance payments can be processed here.", HttpStatus.BAD_REQUEST);
        }
        if (payment.getPaymentStatus() == PaymentStatus.VERIFIED) {
            throw new AppException("This payment is already verified.", HttpStatus.CONFLICT);
        }
        if (payment.getPaymentStatus() == PaymentStatus.REJECTED) {
            throw new AppException("This payment is already rejected.", HttpStatus.CONFLICT);
        }
        if (payment.getPaymentStatus() != PaymentStatus.SUBMITTED
                || order.getFinancialStatus() != FinancialStatus.ADVANCE_SUBMITTED
                || order.getOrderStatus() != OrderStatus.PENDING_ADVANCE_VERIFICATION) {
            throw new AppException("Payment is not eligible for finance verification.", HttpStatus.BAD_REQUEST);
        }
    }

    private List<Payment> findAdvancePayments(PaymentStatus status) {
        return paymentRepository.findByPaymentTypeAndPaymentStatusOrderByCreatedAtDesc(PaymentType.ADVANCE, status);
    }

    private Payment findPayment(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException("Payment not found.", HttpStatus.NOT_FOUND));
    }

    private Payment latestPaymentForOrder(Order order) {
        return paymentRepository.findByOrderIdOrderByCreatedAtDesc(order.getId()).stream()
                .findFirst()
                .orElse(null);
    }

    private List<FinancePaymentSummaryResponse> toSummary(List<Payment> payments) {
        return payments.stream()
                .map(FinancePaymentSummaryResponse::new)
                .toList();
    }

    private void saveStatusHistory(Order order, OrderStatus previousStatus, OrderStatus newStatus, User changedBy,
            String note) {
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setChangedByUser(changedBy);
        history.setNote(note);
        orderStatusHistoryRepository.save(history);
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

    private void createNotification(User user, String title, String message, NotificationType type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setNotificationType(type);
        notification.setReadStatus(ReadStatus.UNREAD);
        notificationRepository.save(notification);
    }

    private void notifyAdmins(String trackingNumber) {
        userRepository.findByRole_Code(RoleCode.ADMIN)
                .forEach(admin -> createNotification(
                        admin,
                        "Action Required: Assign Pickup",
                        "Order " + trackingNumber + " has a verified payment. Please assign a pickup agent.",
                        NotificationType.ORDER_STATUS));
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}
