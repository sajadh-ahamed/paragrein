package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.CompleteDeliveryRequest;
import com.paragrein.logistics.dto.DriverActionRequest;
import com.paragrein.logistics.dto.DriverDashboardSummaryResponse;
import com.paragrein.logistics.dto.DriverDeliveryHistoryResponse;
import com.paragrein.logistics.dto.DriverDeliveryTaskDetailResponse;
import com.paragrein.logistics.dto.DriverDeliveryTaskSummaryResponse;
import com.paragrein.logistics.dto.OrderTimelineResponse;
import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.DeliveryConfirmation;
import com.paragrein.logistics.entity.EmployeeProfile;
import com.paragrein.logistics.entity.Notification;
import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.OrderStatusHistory;
import com.paragrein.logistics.entity.Payment;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.AssignmentType;
import com.paragrein.logistics.enums.AvailabilityStatus;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.NotificationType;
import com.paragrein.logistics.enums.OrderStatus;
import com.paragrein.logistics.enums.PaymentStatus;
import com.paragrein.logistics.enums.PaymentType;
import com.paragrein.logistics.enums.ReadStatus;
import com.paragrein.logistics.enums.RoleCode;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AssignmentRepository;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.DeliveryConfirmationRepository;
import com.paragrein.logistics.repository.EmployeeProfileRepository;
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
public class DriverDeliveryService {

    private static final String BALANCE_PAYMENT_REFERENCE = "CASH_COLLECTED_BY_DRIVER";

    private final AssignmentRepository assignmentRepository;
    private final OrderRepository orderRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final DeliveryConfirmationRepository deliveryConfirmationRepository;
    private final PaymentRepository paymentRepository;

    public DriverDeliveryService(
            AssignmentRepository assignmentRepository,
            OrderRepository orderRepository,
            EmployeeProfileRepository employeeProfileRepository,
            OrderStatusHistoryRepository orderStatusHistoryRepository,
            AuditLogRepository auditLogRepository,
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            DeliveryConfirmationRepository deliveryConfirmationRepository,
            PaymentRepository paymentRepository
    ) {
        this.assignmentRepository = assignmentRepository;
        this.orderRepository = orderRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.deliveryConfirmationRepository = deliveryConfirmationRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public DriverDashboardSummaryResponse getDriverDashboardSummary(Authentication authentication) {
        User driver = SecurityUserUtil.requireCurrentUser(authentication);
        List<Assignment> activeAssignments = findActiveAssignments(driver);
        long completedCount = assignmentRepository.countByAssignmentTypeAndAssignedToUserIdAndAssignmentStatus(
                AssignmentType.DELIVERY,
                driver.getId(),
                AssignmentStatus.COMPLETED
        );
        BigDecimal balanceToCollect = activeAssignments.stream()
                .filter(assignment -> assignment.getOrder().getOrderStatus() == OrderStatus.REACHED_DESTINATION)
                .map(assignment -> assignment.getOrder().getBalanceAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        AvailabilityStatus availabilityStatus = employeeProfileRepository.findByUserId(driver.getId())
                .map(EmployeeProfile::getAvailabilityStatus)
                .orElse(AvailabilityStatus.OFFLINE);

        return new DriverDashboardSummaryResponse(
                countByOrderAndAssignment(activeAssignments, OrderStatus.ASSIGNED_TO_DELIVERY, AssignmentStatus.ASSIGNED),
                countByOrderAndAssignment(activeAssignments, OrderStatus.DELIVERY_ACCEPTED, AssignmentStatus.ACCEPTED),
                countByOrderAndAssignment(activeAssignments, OrderStatus.REACHED_DESTINATION, AssignmentStatus.ACCEPTED),
                completedCount,
                balanceToCollect,
                availabilityStatus
        );
    }

    @Transactional(readOnly = true)
    public List<DriverDeliveryTaskSummaryResponse> getAssignedDeliveries(Authentication authentication) {
        User driver = SecurityUserUtil.requireCurrentUser(authentication);
        return findActiveAssignments(driver).stream()
                .map(DriverDeliveryTaskSummaryResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DriverDeliveryHistoryResponse> getDeliveryHistory(Authentication authentication) {
        User driver = SecurityUserUtil.requireCurrentUser(authentication);
        return assignmentRepository.findByAssignmentTypeAndAssignedToUserIdAndAssignmentStatusInOrderByAssignedAtDesc(
                        AssignmentType.DELIVERY,
                        driver.getId(),
                        List.of(AssignmentStatus.COMPLETED)
                ).stream()
                .map(assignment -> new DriverDeliveryHistoryResponse(assignment, findDeliveryConfirmation(assignment.getOrder().getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public DriverDeliveryTaskDetailResponse getDeliveryTaskDetail(Long assignmentId, Authentication authentication) {
        User driver = SecurityUserUtil.requireCurrentUser(authentication);
        Assignment assignment = findOwnDeliveryAssignment(assignmentId, driver);
        return buildDetail(assignment);
    }

    @Transactional
    public DriverDeliveryTaskDetailResponse acceptDelivery(Long assignmentId, DriverActionRequest request, Authentication authentication) {
        User driver = SecurityUserUtil.requireCurrentUser(authentication);
        Assignment assignment = findOwnDeliveryAssignment(assignmentId, driver);
        Order order = assignment.getOrder();

        if (assignment.getAssignmentStatus() != AssignmentStatus.ASSIGNED || order.getOrderStatus() != OrderStatus.ASSIGNED_TO_DELIVERY) {
            throw new AppException("Only newly assigned delivery tasks can be accepted.", HttpStatus.BAD_REQUEST);
        }

        OrderStatus previousStatus = order.getOrderStatus();
        assignment.setAssignmentStatus(AssignmentStatus.ACCEPTED);
        assignment.setAcceptedAt(LocalDateTime.now());
        Assignment savedAssignment = assignmentRepository.save(assignment);

        order.setOrderStatus(OrderStatus.DELIVERY_ACCEPTED);
        Order savedOrder = orderRepository.save(order);

        String note = actionNote(request, "Delivery task accepted by driver.");
        saveStatusHistory(savedOrder, previousStatus, OrderStatus.DELIVERY_ACCEPTED, driver, note);
        saveAudit(driver, "DELIVERY_ACCEPTED", "Assignment", savedAssignment.getId(), "Accepted delivery for " + savedOrder.getTrackingNumber());
        createNotification(savedOrder.getCustomer(), "Delivery accepted", "Your delivery for order " + savedOrder.getTrackingNumber() + " has been accepted by the driver.", NotificationType.ORDER_STATUS);

        return buildDetail(savedAssignment);
    }

    @Transactional
    public DriverDeliveryTaskDetailResponse markReachedDestination(Long assignmentId, DriverActionRequest request, Authentication authentication) {
        User driver = SecurityUserUtil.requireCurrentUser(authentication);
        Assignment assignment = findOwnDeliveryAssignment(assignmentId, driver);
        Order order = assignment.getOrder();

        if (assignment.getAssignmentStatus() != AssignmentStatus.ACCEPTED || order.getOrderStatus() != OrderStatus.DELIVERY_ACCEPTED) {
            throw new AppException("Delivery must be accepted before marking reached destination.", HttpStatus.BAD_REQUEST);
        }

        OrderStatus previousStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.REACHED_DESTINATION);
        Order savedOrder = orderRepository.save(order);

        DeliveryConfirmation confirmation = deliveryConfirmationRepository.findByOrderId(order.getId())
                .orElseGet(() -> {
                    DeliveryConfirmation created = new DeliveryConfirmation();
                    created.setOrder(order);
                    created.setDriverUser(driver);
                    return created;
                });
        confirmation.setDriverUser(driver);
        confirmation.setReachedDestinationAt(LocalDateTime.now());
        DeliveryConfirmation savedConfirmation = deliveryConfirmationRepository.save(confirmation);

        String note = actionNote(request, "Driver reached destination. Balance collection is pending.");
        saveStatusHistory(savedOrder, previousStatus, OrderStatus.REACHED_DESTINATION, driver, note);
        saveAudit(driver, "DELIVERY_REACHED_DESTINATION", "DeliveryConfirmation", savedConfirmation.getId(), "Reached destination for " + savedOrder.getTrackingNumber());
        createNotification(savedOrder.getCustomer(), "Driver reached destination", "Your parcel for order " + savedOrder.getTrackingNumber() + " has reached the destination.", NotificationType.ORDER_STATUS);

        return buildDetail(assignment);
    }

    @Transactional
    public DriverDeliveryTaskDetailResponse completeDelivery(Long assignmentId, CompleteDeliveryRequest request, Authentication authentication) {
        User driver = SecurityUserUtil.requireCurrentUser(authentication);
        Assignment assignment = findOwnDeliveryAssignment(assignmentId, driver);
        Order order = assignment.getOrder();

        validateCompletionRequest(order, assignment, request);

        OrderStatus previousStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.DELIVERED);
        order.setFinancialStatus(FinancialStatus.FULLY_SETTLED);
        Order savedOrder = orderRepository.save(order);

        assignment.setAssignmentStatus(AssignmentStatus.COMPLETED);
        assignment.setCompletedAt(LocalDateTime.now());
        Assignment savedAssignment = assignmentRepository.save(assignment);

        EmployeeProfile profile = employeeProfileRepository.findByUserId(driver.getId())
                .orElseThrow(() -> new AppException("Driver employee profile not found.", HttpStatus.NOT_FOUND));
        profile.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        employeeProfileRepository.save(profile);

        DeliveryConfirmation confirmation = deliveryConfirmationRepository.findByOrderId(order.getId())
                .orElseGet(() -> {
                    DeliveryConfirmation created = new DeliveryConfirmation();
                    created.setOrder(order);
                    created.setDriverUser(driver);
                    created.setReachedDestinationAt(LocalDateTime.now());
                    return created;
                });
        confirmation.setDriverUser(driver);
        confirmation.setRecipientName(clean(request.getRecipientName()));
        confirmation.setBalanceCollectedAmount(request.getBalanceCollectedAmount());
        confirmation.setProofImagePath(clean(request.getProofImagePath()));
        confirmation.setDeliveryNotes(clean(request.getDeliveryNotes()));
        confirmation.setDeliveredAt(LocalDateTime.now());
        DeliveryConfirmation savedConfirmation = deliveryConfirmationRepository.save(confirmation);

        createBalancePayment(savedOrder, driver);

        saveStatusHistory(savedOrder, previousStatus, OrderStatus.DELIVERED, driver, "Delivery completed and balance collected.");
        saveAudit(driver, "DELIVERY_COMPLETED", "DeliveryConfirmation", savedConfirmation.getId(), "Completed delivery for " + savedOrder.getTrackingNumber());
        saveAudit(driver, "BALANCE_COLLECTED", "Payment", savedOrder.getId(), "Collected balance for " + savedOrder.getTrackingNumber());
        createNotification(savedOrder.getCustomer(), "Parcel delivered", "Your parcel has been delivered successfully.", NotificationType.ORDER_STATUS);
        notifyFinanceAndAdmins(savedOrder.getTrackingNumber());

        return buildDetail(savedAssignment);
    }

    private List<Assignment> findActiveAssignments(User driver) {
        return assignmentRepository.findByAssignmentTypeAndAssignedToUserIdAndAssignmentStatusInOrderByAssignedAtDesc(
                AssignmentType.DELIVERY,
                driver.getId(),
                List.of(AssignmentStatus.ASSIGNED, AssignmentStatus.ACCEPTED)
        );
    }

    private Assignment findOwnDeliveryAssignment(Long assignmentId, User driver) {
        Assignment assignment = assignmentRepository.findByIdAndAssignedToUserId(assignmentId, driver.getId())
                .orElseThrow(() -> new AppException("Delivery assignment not found for current driver.", HttpStatus.NOT_FOUND));
        if (assignment.getAssignmentType() != AssignmentType.DELIVERY) {
            throw new AppException("This assignment is not a delivery task.", HttpStatus.BAD_REQUEST);
        }
        return assignment;
    }

    private DriverDeliveryTaskDetailResponse buildDetail(Assignment assignment) {
        DeliveryConfirmation confirmation = findDeliveryConfirmation(assignment.getOrder().getId());
        List<OrderTimelineResponse> timeline = orderStatusHistoryRepository.findByOrderIdOrderByCreatedAtAsc(assignment.getOrder().getId()).stream()
                .map(OrderTimelineResponse::new)
                .toList();
        return new DriverDeliveryTaskDetailResponse(assignment, confirmation, timeline);
    }

    private DeliveryConfirmation findDeliveryConfirmation(Long orderId) {
        return deliveryConfirmationRepository.findByOrderId(orderId).orElse(null);
    }

    private long countByOrderAndAssignment(List<Assignment> assignments, OrderStatus orderStatus, AssignmentStatus assignmentStatus) {
        return assignments.stream()
                .filter(assignment -> assignment.getAssignmentStatus() == assignmentStatus)
                .filter(assignment -> assignment.getOrder().getOrderStatus() == orderStatus)
                .count();
    }

    private void validateCompletionRequest(Order order, Assignment assignment, CompleteDeliveryRequest request) {
        // Validation rule: a driver can complete delivery only after reaching the destination.
        if (assignment.getAssignmentStatus() != AssignmentStatus.ACCEPTED || order.getOrderStatus() != OrderStatus.REACHED_DESTINATION) {
            throw new AppException("Delivery must reach destination before completion.", HttpStatus.BAD_REQUEST);
        }
        if (order.getOrderStatus() == OrderStatus.DELIVERED || assignment.getAssignmentStatus() == AssignmentStatus.COMPLETED) {
            throw new AppException("Delivery is already completed.", HttpStatus.CONFLICT);
        }
        if (request == null) {
            throw new AppException("Delivery completion details are required.", HttpStatus.BAD_REQUEST);
        }
        requireText(request.getRecipientName(), "Recipient name is required.");
        if (request.getBalanceCollectedAmount() == null) {
            throw new AppException("Balance collected amount is required.", HttpStatus.BAD_REQUEST);
        }
        // Business rule: final settlement requires exact balance collection for the stored order amount.
        if (request.getBalanceCollectedAmount().compareTo(order.getBalanceAmount()) != 0) {
            throw new AppException("Balance collected amount must match the order balance amount.", HttpStatus.BAD_REQUEST);
        }
        paymentRepository.findFirstByOrderIdAndPaymentTypeOrderByCreatedAtDesc(order.getId(), PaymentType.BALANCE)
                .ifPresent(payment -> {
                    if (payment.getPaymentStatus() == PaymentStatus.VERIFIED) {
                        throw new AppException("Balance payment has already been recorded for this order.", HttpStatus.CONFLICT);
                    }
                });
    }

    private void createBalancePayment(Order order, User driver) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentType(PaymentType.BALANCE);
        payment.setAmount(order.getBalanceAmount());
        payment.setPaymentReference(BALANCE_PAYMENT_REFERENCE);
        payment.setPaymentStatus(PaymentStatus.VERIFIED);
        payment.setVerifiedByUser(driver);
        payment.setVerifiedAt(LocalDateTime.now());
        paymentRepository.save(payment);
    }

    private String actionNote(DriverActionRequest request, String fallback) {
        if (request == null || isBlank(request.getNote())) {
            return fallback;
        }
        return clean(request.getNote());
    }

    private void saveStatusHistory(Order order, OrderStatus previousStatus, OrderStatus newStatus, User changedBy, String note) {
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

    private void notifyFinanceAndAdmins(String trackingNumber) {
        userRepository.findByRole_Code(RoleCode.ADMIN)
                .forEach(admin -> createNotification(admin, "Delivery completed", "Order " + trackingNumber + " has been delivered and settled.", NotificationType.ORDER_STATUS));
        userRepository.findByRole_Code(RoleCode.FINANCE_OFFICER)
                .forEach(finance -> createNotification(finance, "Balance collected", "Balance payment was collected for order " + trackingNumber + ".", NotificationType.PAYMENT));
    }

    private void requireText(String value, String message) {
        if (isBlank(value)) {
            throw new AppException(message, HttpStatus.BAD_REQUEST);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}
