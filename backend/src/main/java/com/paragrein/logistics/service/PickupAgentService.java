package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.OrderTimelineResponse;
import com.paragrein.logistics.dto.PickupActionRequest;
import com.paragrein.logistics.dto.PickupDashboardSummaryResponse;
import com.paragrein.logistics.dto.PickupTaskDetailResponse;
import com.paragrein.logistics.dto.PickupTaskSummaryResponse;
import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.EmployeeProfile;
import com.paragrein.logistics.entity.Notification;
import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.OrderStatusHistory;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.AssignmentType;
import com.paragrein.logistics.enums.AvailabilityStatus;
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
import com.paragrein.logistics.security.SecurityUserUtil;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PickupAgentService {

    private final AssignmentRepository assignmentRepository;
    private final OrderRepository orderRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public PickupAgentService(
            AssignmentRepository assignmentRepository,
            OrderRepository orderRepository,
            EmployeeProfileRepository employeeProfileRepository,
            OrderStatusHistoryRepository orderStatusHistoryRepository,
            AuditLogRepository auditLogRepository,
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {
        this.assignmentRepository = assignmentRepository;
        this.orderRepository = orderRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PickupDashboardSummaryResponse getPickupDashboardSummary(Authentication authentication) {
        User pickupAgent = SecurityUserUtil.requireCurrentUser(authentication);
        List<Assignment> activeAssignments = findActiveAssignments(pickupAgent);
        long completedCount = assignmentRepository.countByAssignmentTypeAndAssignedToUserIdAndAssignmentStatus(
                AssignmentType.PICKUP,
                pickupAgent.getId(),
                AssignmentStatus.COMPLETED
        );
        AvailabilityStatus availabilityStatus = employeeProfileRepository.findByUserId(pickupAgent.getId())
                .map(EmployeeProfile::getAvailabilityStatus)
                .orElse(AvailabilityStatus.OFFLINE);

        return new PickupDashboardSummaryResponse(
                countByOrderAndAssignment(activeAssignments, OrderStatus.ASSIGNED_TO_PICKUP, AssignmentStatus.ASSIGNED),
                countByOrderAndAssignment(activeAssignments, OrderStatus.PICKUP_ACCEPTED, AssignmentStatus.ACCEPTED),
                countByOrderAndAssignment(activeAssignments, OrderStatus.IN_TRANSIT_TO_WAREHOUSE, AssignmentStatus.ACCEPTED),
                completedCount,
                availabilityStatus
        );
    }

    @Transactional(readOnly = true)
    public List<PickupTaskSummaryResponse> getAssignedPickupTasks(Authentication authentication) {
        User pickupAgent = SecurityUserUtil.requireCurrentUser(authentication);
        return findActiveAssignments(pickupAgent).stream()
                .map(PickupTaskSummaryResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public PickupTaskDetailResponse getPickupTaskDetail(Long assignmentId, Authentication authentication) {
        User pickupAgent = SecurityUserUtil.requireCurrentUser(authentication);
        Assignment assignment = findOwnPickupAssignment(assignmentId, pickupAgent);
        return buildDetail(assignment);
    }

    @Transactional
    public PickupTaskDetailResponse acceptPickupTask(Long assignmentId, PickupActionRequest request, Authentication authentication) {
        User pickupAgent = SecurityUserUtil.requireCurrentUser(authentication);
        Assignment assignment = findOwnPickupAssignment(assignmentId, pickupAgent);
        Order order = assignment.getOrder();

        if (assignment.getAssignmentStatus() != AssignmentStatus.ASSIGNED || order.getOrderStatus() != OrderStatus.ASSIGNED_TO_PICKUP) {
            throw new AppException("Only newly assigned pickup tasks can be accepted.", HttpStatus.BAD_REQUEST);
        }

        OrderStatus previousStatus = order.getOrderStatus();
        assignment.setAssignmentStatus(AssignmentStatus.ACCEPTED);
        assignment.setAcceptedAt(LocalDateTime.now());
        Assignment savedAssignment = assignmentRepository.save(assignment);

        order.setOrderStatus(OrderStatus.PICKUP_ACCEPTED);
        Order savedOrder = orderRepository.save(order);

        String note = actionNote(request, "Pickup task accepted by pickup agent.");
        saveStatusHistory(savedOrder, previousStatus, OrderStatus.PICKUP_ACCEPTED, pickupAgent, note);
        saveAudit(pickupAgent, "PICKUP_TASK_ACCEPTED", "Assignment", savedAssignment.getId(), "Accepted pickup for " + savedOrder.getTrackingNumber());
        createNotification(savedOrder.getCustomer(), "Pickup accepted", "Your pickup for order " + savedOrder.getTrackingNumber() + " has been accepted.", NotificationType.ORDER_STATUS);

        return buildDetail(savedAssignment);
    }

    @Transactional
    public PickupTaskDetailResponse markParcelPickedUp(Long assignmentId, PickupActionRequest request, Authentication authentication) {
        User pickupAgent = SecurityUserUtil.requireCurrentUser(authentication);
        Assignment assignment = findOwnPickupAssignment(assignmentId, pickupAgent);
        Order order = assignment.getOrder();

        if (assignment.getAssignmentStatus() != AssignmentStatus.ACCEPTED || order.getOrderStatus() != OrderStatus.PICKUP_ACCEPTED) {
            throw new AppException("Pickup task must be accepted before marking the parcel as picked up.", HttpStatus.BAD_REQUEST);
        }

        OrderStatus previousStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.IN_TRANSIT_TO_WAREHOUSE);
        Order savedOrder = orderRepository.save(order);

        String note = actionNote(request, "Parcel picked up and is in transit to warehouse.");
        saveStatusHistory(savedOrder, previousStatus, OrderStatus.IN_TRANSIT_TO_WAREHOUSE, pickupAgent, note);
        saveAudit(pickupAgent, "PARCEL_MARKED_PICKED_UP", "Assignment", assignment.getId(), "Parcel picked up for " + savedOrder.getTrackingNumber());
        createNotification(savedOrder.getCustomer(), "Parcel picked up", "Your parcel for order " + savedOrder.getTrackingNumber() + " is in transit to the warehouse.", NotificationType.ORDER_STATUS);

        return buildDetail(assignment);
    }

    //reject pickup task
//    @Transactional
//    public PickupTaskDetailResponse rejectPickupTask(Long assignmentId,
//                                                     PickupActionRequest request,
//                                                     Authentication authentication) {
//
//        User pickupAgent = SecurityUserUtil.requireCurrentUser(authentication);
//
//        Assignment assignment = findOwnPickupAssignment(assignmentId, pickupAgent);
//
//        Order order = assignment.getOrder();
//
//        if (assignment.getAssignmentStatus() != AssignmentStatus.ASSIGNED
//                || order.getOrderStatus() != OrderStatus.ASSIGNED_TO_PICKUP) {
//            throw new AppException(
//                    "Only newly assigned pickup tasks can be rejected.",
//                    HttpStatus.BAD_REQUEST);
//        }
//
//        OrderStatus previousStatus = order.getOrderStatus();
//
//        assignment.setAssignmentStatus(AssignmentStatus.REJECTED);
//        assignment.setRejectedAt(LocalDateTime.now());
//        assignment.setRejectionReason(actionNote(request,
//                "Pickup assignment rejected."));
//
//        Assignment savedAssignment = assignmentRepository.save(assignment);
//
//        order.setOrderStatus(OrderStatus.PENDING_ADVANCE_VERIFICATION);
//        Order savedOrder = orderRepository.save(order);
//
//        EmployeeProfile profile = employeeProfileRepository
//                .findByUserId(pickupAgent.getId())
//                .orElseThrow(() -> new AppException(
//                        "Pickup agent employee profile not found.",
//                        HttpStatus.NOT_FOUND));
//
//        profile.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
//        employeeProfileRepository.save(profile);
//
//        saveStatusHistory(
//                savedOrder,
//                previousStatus,
//                OrderStatus.PENDING_ADVANCE_VERIFICATION,
//                pickupAgent,
//                "Pickup rejected: " + assignment.getRejectionReason());
//
//        saveAudit(
//                pickupAgent,
//                "PICKUP_TASK_REJECTED",
//                "Assignment",
//                savedAssignment.getId(),
//                "Rejected pickup for " + savedOrder.getTrackingNumber());
//
//        userRepository.findByRole_Code(RoleCode.ADMIN)
//                .forEach(admin -> createNotification(
//                        admin,
//                        "Pickup Assignment Rejected",
//                        "Pickup agent rejected order "
//                                + savedOrder.getTrackingNumber()
//                                + ". Please assign another pickup agent.",
//                        NotificationType.ASSIGNMENT));
//
//        createNotification(
//                savedOrder.getCustomer(),
//                "Pickup Reassignment",
//                "Your pickup is being reassigned to another pickup agent.",
//                NotificationType.ORDER_STATUS);
//
//        return buildDetail(savedAssignment);
//    }

    @Transactional
    public PickupTaskDetailResponse markReachedWarehouse(Long assignmentId, PickupActionRequest request, Authentication authentication) {
        User pickupAgent = SecurityUserUtil.requireCurrentUser(authentication);
        Assignment assignment = findOwnPickupAssignment(assignmentId, pickupAgent);
        Order order = assignment.getOrder();

        if (assignment.getAssignmentStatus() != AssignmentStatus.ACCEPTED || order.getOrderStatus() != OrderStatus.IN_TRANSIT_TO_WAREHOUSE) {
            throw new AppException("Parcel must be in transit before it can be marked as reached warehouse.", HttpStatus.BAD_REQUEST);
        }

        OrderStatus previousStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.ARRIVED_AT_WAREHOUSE);
        Order savedOrder = orderRepository.save(order);

        assignment.setAssignmentStatus(AssignmentStatus.COMPLETED);
        assignment.setCompletedAt(LocalDateTime.now());
        Assignment savedAssignment = assignmentRepository.save(assignment);

        EmployeeProfile profile = employeeProfileRepository.findByUserId(pickupAgent.getId())
                .orElseThrow(() -> new AppException("Pickup agent employee profile not found.", HttpStatus.NOT_FOUND));
        profile.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        employeeProfileRepository.save(profile);

        String note = actionNote(request, "Parcel reached warehouse. Pickup assignment completed.");
        saveStatusHistory(savedOrder, previousStatus, OrderStatus.ARRIVED_AT_WAREHOUSE, pickupAgent, note);
        saveAudit(pickupAgent, "PARCEL_REACHED_WAREHOUSE", "Assignment", savedAssignment.getId(), "Parcel reached warehouse for " + savedOrder.getTrackingNumber());
        createNotification(savedOrder.getCustomer(), "Parcel reached warehouse", "Your parcel for order " + savedOrder.getTrackingNumber() + " has reached the warehouse.", NotificationType.ORDER_STATUS);
        notifyWarehouseStaff(savedOrder.getTrackingNumber());

        return buildDetail(savedAssignment);
    }

    @Transactional(readOnly = true)
    public List<PickupTaskSummaryResponse> getPickupHistory(Authentication authentication) {
        User pickupAgent = SecurityUserUtil.requireCurrentUser(authentication);
        return assignmentRepository.findByAssignmentTypeAndAssignedToUserIdAndAssignmentStatusInOrderByAssignedAtDesc(
                        AssignmentType.PICKUP,
                        pickupAgent.getId(),
                        List.of(AssignmentStatus.COMPLETED)
                ).stream()
                .map(PickupTaskSummaryResponse::new)
                .toList();
    }

    private List<Assignment> findActiveAssignments(User pickupAgent) {
        return assignmentRepository.findByAssignmentTypeAndAssignedToUserIdAndAssignmentStatusInOrderByAssignedAtDesc(
                AssignmentType.PICKUP,
                pickupAgent.getId(),
                List.of(AssignmentStatus.ASSIGNED, AssignmentStatus.ACCEPTED)
        );
    }

    private Assignment findOwnPickupAssignment(Long assignmentId, User pickupAgent) {
        // Security note: pickup agents can only view or update assignments assigned to their own user id.
        Assignment assignment = assignmentRepository.findByIdAndAssignedToUserId(assignmentId, pickupAgent.getId())
                .orElseThrow(() -> new AppException("Pickup assignment not found for current pickup agent.", HttpStatus.NOT_FOUND));
        if (assignment.getAssignmentType() != AssignmentType.PICKUP) {
            throw new AppException("This assignment is not a pickup task.", HttpStatus.BAD_REQUEST);
        }
        if (assignment.getAssignmentStatus() == AssignmentStatus.COMPLETED || assignment.getAssignmentStatus() == AssignmentStatus.CANCELLED) {
            return assignment;
        }
        return assignment;
    }

    private PickupTaskDetailResponse buildDetail(Assignment assignment) {
        List<OrderTimelineResponse> timeline = orderStatusHistoryRepository.findByOrderIdOrderByCreatedAtAsc(assignment.getOrder().getId()).stream()
                .map(OrderTimelineResponse::new)
                .toList();
        return new PickupTaskDetailResponse(assignment, timeline);
    }

    private long countByOrderAndAssignment(List<Assignment> assignments, OrderStatus orderStatus, AssignmentStatus assignmentStatus) {
        return assignments.stream()
                .filter(assignment -> assignment.getAssignmentStatus() == assignmentStatus)
                .filter(assignment -> assignment.getOrder().getOrderStatus() == orderStatus)
                .count();
    }

    private String actionNote(PickupActionRequest request, String fallback) {
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

    private void notifyWarehouseStaff(String trackingNumber) {
        userRepository.findByRole_Code(RoleCode.WAREHOUSE_STAFF)
                .forEach(warehouseUser -> createNotification(
                        warehouseUser,
                        "Parcel arrived at warehouse",
                        "Order " + trackingNumber + " has arrived at the warehouse and is ready for warehouse processing.",
                        NotificationType.ORDER_STATUS
                ));
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}
