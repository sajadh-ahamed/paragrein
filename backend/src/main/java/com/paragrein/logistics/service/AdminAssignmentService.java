package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.AssignPickupAgentRequest;
import com.paragrein.logistics.dto.AssignDriverRequest;
import com.paragrein.logistics.dto.AssignmentResponse;
import com.paragrein.logistics.dto.AdminDeliveryAssignmentSummaryResponse;
import com.paragrein.logistics.dto.DeliveryAssignmentResponse;
import com.paragrein.logistics.dto.DriverAvailabilityResponse;
import com.paragrein.logistics.dto.EmployeeAvailabilityResponse;
import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.EmployeeProfile;
import com.paragrein.logistics.entity.Notification;
import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.OrderStatusHistory;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.entity.WarehouseRecord;
import com.paragrein.logistics.enums.AccountStatus;
import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.AssignmentType;
import com.paragrein.logistics.enums.AvailabilityStatus;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.NotificationType;
import com.paragrein.logistics.enums.OrderStatus;
import com.paragrein.logistics.enums.ReadStatus;
import com.paragrein.logistics.enums.RoleCode;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AssignmentRepository;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.EmployeeProfileRepository;
import com.paragrein.logistics.repository.NotificationRepository;
import com.paragrein.logistics.repository.OrderRepository;
import com.paragrein.logistics.repository.OrderStatusHistoryRepository;
import com.paragrein.logistics.repository.UserRepository;
import com.paragrein.logistics.repository.WarehouseRecordRepository;
import com.paragrein.logistics.security.SecurityUserUtil;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminAssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;
    private final WarehouseRecordRepository warehouseRecordRepository;

    public AdminAssignmentService(
            AssignmentRepository assignmentRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            EmployeeProfileRepository employeeProfileRepository,
            OrderStatusHistoryRepository orderStatusHistoryRepository,
            AuditLogRepository auditLogRepository,
            NotificationRepository notificationRepository,
            WarehouseRecordRepository warehouseRecordRepository) {
        this.assignmentRepository = assignmentRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationRepository = notificationRepository;
        this.warehouseRecordRepository = warehouseRecordRepository;
    }

    @Transactional
    public AssignmentResponse assignPickupAgentToOrder(Long orderId, AssignPickupAgentRequest request,
            Authentication authentication) {
        User admin = SecurityUserUtil.requireCurrentUser(authentication);
        if (request == null || request.getPickupAgentUserId() == null) {
            throw new AppException("Pickup agent is required.", HttpStatus.BAD_REQUEST);
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException("Order not found.", HttpStatus.NOT_FOUND));
        validateOrderReadyForPickup(order);
        validateNoActivePickupAssignment(order);

        User pickupAgent = userRepository.findById(request.getPickupAgentUserId())
                .orElseThrow(() -> new AppException("Pickup agent not found.", HttpStatus.NOT_FOUND));
        EmployeeProfile profile = employeeProfileRepository.findByUserId(pickupAgent.getId())
                .orElseThrow(() -> new AppException("Pickup agent employee profile not found.", HttpStatus.NOT_FOUND));
        validatePickupAgent(pickupAgent, profile);

        Assignment assignment = new Assignment();
        assignment.setOrder(order);
        assignment.setAssignmentType(AssignmentType.PICKUP);
        assignment.setAssignmentStatus(AssignmentStatus.ASSIGNED);
        assignment.setAssignedToUser(pickupAgent);
        assignment.setAssignedByUser(admin);
        assignment.setAssignedAt(LocalDateTime.now());
        Assignment savedAssignment = assignmentRepository.save(assignment);

        OrderStatus previousStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.ASSIGNED_TO_PICKUP);
        Order savedOrder = orderRepository.save(order);

        profile.setAvailabilityStatus(AvailabilityStatus.BUSY);
        employeeProfileRepository.save(profile);

        String note = isBlank(request.getNote()) ? "Pickup agent assigned by admin." : clean(request.getNote());
        saveStatusHistory(savedOrder, previousStatus, OrderStatus.ASSIGNED_TO_PICKUP, admin, note);
        saveAudit(admin, "PICKUP_AGENT_ASSIGNED", "Assignment", savedAssignment.getId(),
                "Assigned " + pickupAgent.getUsername() + " to " + savedOrder.getTrackingNumber());
        createNotification(pickupAgent, "Pickup assigned",
                "Order " + savedOrder.getTrackingNumber() + " has been assigned to you for pickup.",
                NotificationType.ASSIGNMENT);
        createNotification(savedOrder.getCustomer(), "Pickup assigned", "Your parcel pickup has been assigned.",
                NotificationType.ORDER_STATUS);

        return new AssignmentResponse(savedAssignment);
    }

    @Transactional
    public DeliveryAssignmentResponse assignDriverToOrder(Long orderId, AssignDriverRequest request,
            Authentication authentication) {
        User admin = SecurityUserUtil.requireCurrentUser(authentication);
        if (request == null || request.getDriverUserId() == null) {
            throw new AppException("Driver is required.", HttpStatus.BAD_REQUEST);
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException("Order not found.", HttpStatus.NOT_FOUND));
        validateOrderReadyForDriver(order);
        validateNoActiveDeliveryAssignment(order);

        User driver = userRepository.findById(request.getDriverUserId())
                .orElseThrow(() -> new AppException("Driver not found.", HttpStatus.NOT_FOUND));
        EmployeeProfile profile = employeeProfileRepository.findByUserId(driver.getId())
                .orElseThrow(() -> new AppException("Driver employee profile not found.", HttpStatus.NOT_FOUND));
        validateDriver(driver, profile);

        Assignment assignment = new Assignment();
        assignment.setOrder(order);
        assignment.setAssignmentType(AssignmentType.DELIVERY);
        assignment.setAssignmentStatus(AssignmentStatus.ASSIGNED);
        assignment.setAssignedToUser(driver);
        assignment.setAssignedByUser(admin);
        assignment.setAssignedAt(LocalDateTime.now());
        Assignment savedAssignment = assignmentRepository.save(assignment);

        OrderStatus previousStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.ASSIGNED_TO_DELIVERY);
        Order savedOrder = orderRepository.save(order);

        profile.setAvailabilityStatus(AvailabilityStatus.BUSY);
        employeeProfileRepository.save(profile);

        String note = isBlank(request.getNote()) ? "Driver assigned by admin for final delivery."
                : clean(request.getNote());
        saveStatusHistory(savedOrder, previousStatus, OrderStatus.ASSIGNED_TO_DELIVERY, admin, note);
        saveAudit(admin, "DRIVER_ASSIGNED", "Assignment", savedAssignment.getId(),
                "Assigned " + driver.getUsername() + " to " + savedOrder.getTrackingNumber());
        createNotification(driver, "Delivery assigned",
                "Order " + savedOrder.getTrackingNumber() + " has been assigned to you for final delivery.",
                NotificationType.ASSIGNMENT);
        createNotification(savedOrder.getCustomer(), "Final delivery assigned",
                "Your parcel has been assigned for final delivery.", NotificationType.ORDER_STATUS);

        return new DeliveryAssignmentResponse(savedAssignment);
    }

    @Transactional(readOnly = true)
    public List<EmployeeAvailabilityResponse> getAvailablePickupAgents() {
        return employeeProfileRepository.findByUser_Role_CodeAndUser_AccountStatusAndAvailabilityStatus(
                RoleCode.PICKUP_AGENT,
                AccountStatus.ACTIVE,
                AvailabilityStatus.AVAILABLE).stream()
                .map(EmployeeAvailabilityResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DriverAvailabilityResponse> getAvailableDrivers() {
        return employeeProfileRepository.findByUser_Role_CodeAndUser_AccountStatusAndAvailabilityStatus(
                RoleCode.DRIVER,
                AccountStatus.ACTIVE,
                AvailabilityStatus.AVAILABLE).stream()
                .map(DriverAvailabilityResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getActivePickupAssignments() {
        return assignmentRepository.findByAssignmentTypeAndAssignmentStatusInOrderByAssignedAtDesc(
                AssignmentType.PICKUP,
                List.of(AssignmentStatus.ASSIGNED, AssignmentStatus.ACCEPTED)).stream()
                .map(AssignmentResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentDetail(Long assignmentId) {
        return new AssignmentResponse(assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new AppException("Assignment not found.", HttpStatus.NOT_FOUND)));
    }

    @Transactional(readOnly = true)
    public List<AdminDeliveryAssignmentSummaryResponse> getActiveDeliveryAssignments() {
        return assignmentRepository.findByAssignmentTypeAndAssignmentStatusInOrderByAssignedAtDesc(
                AssignmentType.DELIVERY,
                List.of(AssignmentStatus.ASSIGNED, AssignmentStatus.ACCEPTED)).stream()
                .map(AdminDeliveryAssignmentSummaryResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public DeliveryAssignmentResponse getDeliveryAssignmentDetail(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new AppException("Assignment not found.", HttpStatus.NOT_FOUND));
        if (assignment.getAssignmentType() != AssignmentType.DELIVERY) {
            throw new AppException("Assignment is not a delivery assignment.", HttpStatus.BAD_REQUEST);
        }
        return new DeliveryAssignmentResponse(assignment);
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentHistory() {
        return assignmentRepository.findAllByOrderByAssignedAtDesc().stream()
                .map(AssignmentResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentHistoryForOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new AppException("Order not found.", HttpStatus.NOT_FOUND);
        }
        return assignmentRepository.findByOrderIdOrderByAssignedAtDesc(orderId).stream()
                .map(AssignmentResponse::new)
                .toList();
    }

    private void validateOrderReadyForPickup(Order order) {
        // Business rule: finance verification is required before a pickup agent can be
        // assigned.
        if (order.getFinancialStatus() != FinancialStatus.ADVANCE_VERIFIED) {
            throw new AppException("Order advance payment must be verified before pickup assignment.",
                    HttpStatus.BAD_REQUEST);
        }
        if (order.getOrderStatus() != OrderStatus.PENDING_ADVANCE_VERIFICATION) {
            throw new AppException("Order is not in the pickup assignment queue.", HttpStatus.BAD_REQUEST);
        }
    }

    private void validateNoActivePickupAssignment(Order order) {
        boolean exists = assignmentRepository.existsByOrderIdAndAssignmentTypeAndAssignmentStatusIn(
                order.getId(),
                AssignmentType.PICKUP,
                List.of(AssignmentStatus.ASSIGNED, AssignmentStatus.ACCEPTED));
        if (exists) {
            throw new AppException("This order already has an active pickup assignment.", HttpStatus.CONFLICT);
        }
    }

    private void validateOrderReadyForDriver(Order order) {
        // Business rule: driver assignment starts only after warehouse dispatch
        // readiness is recorded.
        if (order.getOrderStatus() != OrderStatus.READY_FOR_DISPATCH) {
            throw new AppException("Order must be ready for dispatch before driver assignment.",
                    HttpStatus.BAD_REQUEST);
        }
        if (order.getFinancialStatus() != FinancialStatus.ADVANCE_VERIFIED
                && order.getFinancialStatus() != FinancialStatus.BALANCE_DUE) {
            throw new AppException("Order payment status is not valid for driver assignment.", HttpStatus.BAD_REQUEST);
        }
        WarehouseRecord warehouseRecord = warehouseRecordRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new AppException("Warehouse record is required before driver assignment.",
                        HttpStatus.BAD_REQUEST));
        if (warehouseRecord.getReadyForDispatchAt() == null) {
            throw new AppException("Warehouse record is not marked ready for dispatch.", HttpStatus.BAD_REQUEST);
        }
    }

    private void validateNoActiveDeliveryAssignment(Order order) {
        boolean exists = assignmentRepository.existsByOrderIdAndAssignmentTypeAndAssignmentStatusIn(
                order.getId(),
                AssignmentType.DELIVERY,
                List.of(AssignmentStatus.ASSIGNED, AssignmentStatus.ACCEPTED));
        if (exists) {
            throw new AppException("This order already has an active delivery assignment.", HttpStatus.CONFLICT);
        }
    }

    private void validatePickupAgent(User user, EmployeeProfile profile) {
        if (user.getRole().getCode() != RoleCode.PICKUP_AGENT) {
            throw new AppException("Selected employee is not a pickup agent.", HttpStatus.BAD_REQUEST);
        }
        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new AppException("Selected pickup agent account is not active.", HttpStatus.BAD_REQUEST);
        }
        if (profile.getAvailabilityStatus() != AvailabilityStatus.AVAILABLE) {
            throw new AppException("Selected pickup agent is not available.", HttpStatus.CONFLICT);
        }
    }

    private void validateDriver(User user, EmployeeProfile profile) {
        // Validation rule: only active and available DRIVER users can receive delivery
        // assignments.
        if (user.getRole().getCode() != RoleCode.DRIVER) {
            throw new AppException("Selected employee is not a driver.", HttpStatus.BAD_REQUEST);
        }
        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new AppException("Selected driver account is not active.", HttpStatus.BAD_REQUEST);
        }
        if (profile.getAvailabilityStatus() != AvailabilityStatus.AVAILABLE) {
            throw new AppException("Selected driver is not available.", HttpStatus.CONFLICT);
        }
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

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}
