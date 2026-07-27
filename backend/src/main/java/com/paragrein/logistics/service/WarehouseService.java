package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.ConfirmWarehouseArrivalRequest;
import com.paragrein.logistics.dto.MarkReadyForDispatchRequest;
import com.paragrein.logistics.dto.MarkWarehouseProcessingRequest;
import com.paragrein.logistics.dto.OrderTimelineResponse;
import com.paragrein.logistics.dto.WarehouseDashboardSummaryResponse;
import com.paragrein.logistics.dto.WarehouseOrderDetailResponse;
import com.paragrein.logistics.dto.WarehouseOrderSummaryResponse;
import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.EmployeeProfile;
import com.paragrein.logistics.entity.Notification;
import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.OrderStatusHistory;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.entity.WarehouseRecord;
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
import com.paragrein.logistics.repository.WarehouseRecordRepository;
import com.paragrein.logistics.security.SecurityUserUtil;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WarehouseService {

    private final OrderRepository orderRepository;
    private final WarehouseRecordRepository warehouseRecordRepository;
    private final AssignmentRepository assignmentRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public WarehouseService(
            OrderRepository orderRepository,
            WarehouseRecordRepository warehouseRecordRepository,
            AssignmentRepository assignmentRepository,
            EmployeeProfileRepository employeeProfileRepository,
            OrderStatusHistoryRepository orderStatusHistoryRepository,
            AuditLogRepository auditLogRepository,
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.warehouseRecordRepository = warehouseRecordRepository;
        this.assignmentRepository = assignmentRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public WarehouseDashboardSummaryResponse getWarehouseDashboardSummary(Authentication authentication) {
        User staff = SecurityUserUtil.requireCurrentUser(authentication);
        AvailabilityStatus staffStatus = employeeProfileRepository.findByUserId(staff.getId())
                .map(EmployeeProfile::getAvailabilityStatus)
                .orElse(AvailabilityStatus.OFFLINE);

        return new WarehouseDashboardSummaryResponse(
                orderRepository.countByOrderStatus(OrderStatus.ARRIVED_AT_WAREHOUSE),
                orderRepository.countByOrderStatus(OrderStatus.WAREHOUSE_PROCESSING),
                orderRepository.countByOrderStatus(OrderStatus.READY_FOR_DISPATCH),
                warehouseRecordRepository.countByReadyForDispatchAtIsNotNull(),
                staffStatus
        );
    }

    @Transactional(readOnly = true)
    public List<WarehouseOrderSummaryResponse> getArrivalQueue() {
        return orderRepository.findByOrderStatusOrderByUpdatedAtDesc(OrderStatus.ARRIVED_AT_WAREHOUSE).stream()
                .map(WarehouseOrderSummaryResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<WarehouseOrderSummaryResponse> getProcessingOrders() {
        return warehouseRecordRepository.findByOrder_OrderStatusOrderByReceivedAtDesc(OrderStatus.WAREHOUSE_PROCESSING).stream()
                .map(record -> new WarehouseOrderSummaryResponse(record.getOrder(), record))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<WarehouseOrderSummaryResponse> getReadyForDispatchOrders() {
        return warehouseRecordRepository.findByOrder_OrderStatusOrderByReceivedAtDesc(OrderStatus.READY_FOR_DISPATCH).stream()
                .map(record -> new WarehouseOrderSummaryResponse(record.getOrder(), record))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<WarehouseOrderSummaryResponse> getWarehouseHistory() {
        return warehouseRecordRepository.findByReadyForDispatchAtIsNotNullOrderByReadyForDispatchAtDesc().stream()
                .map(record -> new WarehouseOrderSummaryResponse(record.getOrder(), record))
                .toList();
    }

    @Transactional(readOnly = true)
    public WarehouseOrderDetailResponse getWarehouseOrderDetail(Long orderId) {
        Order order = findOrder(orderId);
        WarehouseRecord record = warehouseRecordRepository.findByOrderId(orderId).orElse(null);
        Assignment pickupAssignment = latestPickupAssignment(orderId);
        return buildDetail(order, record, pickupAssignment);
    }

    @Transactional
    public WarehouseOrderDetailResponse confirmArrival(Long orderId, ConfirmWarehouseArrivalRequest request, Authentication authentication) {
        User staff = SecurityUserUtil.requireCurrentUser(authentication);
        Order order = findOrder(orderId);
        validateConfirmArrival(order, request);

        WarehouseRecord record = createWarehouseRecord(order, request, staff);
        OrderStatus previousStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.WAREHOUSE_PROCESSING);
        Order savedOrder = orderRepository.save(order);

        saveStatusHistory(savedOrder, previousStatus, OrderStatus.WAREHOUSE_PROCESSING, staff, "Warehouse arrival confirmed and parcel moved to processing.");
        saveAudit(staff, "WAREHOUSE_ARRIVAL_CONFIRMED", "WarehouseRecord", record.getId(), "Confirmed warehouse arrival for " + savedOrder.getTrackingNumber());
        createNotification(savedOrder.getCustomer(), "Parcel confirmed at warehouse", "Order " + savedOrder.getTrackingNumber() + " is now being processed at the warehouse.", NotificationType.ORDER_STATUS);

        return buildDetail(savedOrder, record, latestPickupAssignment(orderId));
    }

    @Transactional
    public WarehouseOrderDetailResponse markProcessing(Long orderId, MarkWarehouseProcessingRequest request, Authentication authentication) {
        User staff = SecurityUserUtil.requireCurrentUser(authentication);
        Order order = findOrder(orderId);

        if (order.getOrderStatus() == OrderStatus.WAREHOUSE_PROCESSING) {
            WarehouseRecord record = warehouseRecordRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new AppException("Warehouse record is missing for this processing order.", HttpStatus.CONFLICT));
            saveAudit(staff, "WAREHOUSE_PROCESSING_CONFIRMED", "WarehouseRecord", record.getId(), "Confirmed processing state for " + order.getTrackingNumber());
            return buildDetail(order, record, latestPickupAssignment(orderId));
        }

        if (order.getOrderStatus() != OrderStatus.ARRIVED_AT_WAREHOUSE) {
            throw new AppException("Only warehouse-arrived or processing orders can be marked processing.", HttpStatus.BAD_REQUEST);
        }
        validateConfirmArrival(order, request);

        WarehouseRecord record = createWarehouseRecord(order, request, staff);
        OrderStatus previousStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.WAREHOUSE_PROCESSING);
        Order savedOrder = orderRepository.save(order);

        saveStatusHistory(savedOrder, previousStatus, OrderStatus.WAREHOUSE_PROCESSING, staff, "Warehouse processing confirmed.");
        saveAudit(staff, "WAREHOUSE_PROCESSING_MARKED", "WarehouseRecord", record.getId(), "Marked processing for " + savedOrder.getTrackingNumber());
        createNotification(savedOrder.getCustomer(), "Parcel processing started", "Order " + savedOrder.getTrackingNumber() + " is being processed at the warehouse.", NotificationType.ORDER_STATUS);

        return buildDetail(savedOrder, record, latestPickupAssignment(orderId));
    }

    @Transactional
    public WarehouseOrderDetailResponse markReadyForDispatch(Long orderId, MarkReadyForDispatchRequest request, Authentication authentication) {
        User staff = SecurityUserUtil.requireCurrentUser(authentication);
        Order order = findOrder(orderId);
        if (order.getOrderStatus() != OrderStatus.WAREHOUSE_PROCESSING) {
            throw new AppException("Only warehouse processing orders can be marked ready for dispatch.", HttpStatus.BAD_REQUEST);
        }

        WarehouseRecord record = warehouseRecordRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException("Warehouse record must exist before dispatch readiness.", HttpStatus.BAD_REQUEST));

        OrderStatus previousStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.READY_FOR_DISPATCH);
        Order savedOrder = orderRepository.save(order);

        record.setReadyForDispatchAt(LocalDateTime.now());
        WarehouseRecord savedRecord = warehouseRecordRepository.save(record);

        String note = request == null || isBlank(request.getNote())
                ? "Parcel marked ready for dispatch."
                : clean(request.getNote());
        saveStatusHistory(savedOrder, previousStatus, OrderStatus.READY_FOR_DISPATCH, staff, note);
        saveAudit(staff, "PARCEL_READY_FOR_DISPATCH", "WarehouseRecord", savedRecord.getId(), "Marked ready for dispatch for " + savedOrder.getTrackingNumber());
        createNotification(savedOrder.getCustomer(), "Parcel ready for dispatch", "Order " + savedOrder.getTrackingNumber() + " is ready for driver assignment.", NotificationType.ORDER_STATUS);
        notifyAdmins(savedOrder.getTrackingNumber());

        return buildDetail(savedOrder, savedRecord, latestPickupAssignment(orderId));
    }

    private void validateConfirmArrival(Order order, ConfirmWarehouseArrivalRequest request) {
        // Validation rule: warehouse records can only be created after a completed pickup reaches the warehouse.
        if (order.getOrderStatus() != OrderStatus.ARRIVED_AT_WAREHOUSE) {
            throw new AppException("Parcel must reach warehouse before arrival can be confirmed.", HttpStatus.BAD_REQUEST);
        }
        if (!assignmentRepository.existsByOrderIdAndAssignmentTypeAndAssignmentStatus(order.getId(), AssignmentType.PICKUP, AssignmentStatus.COMPLETED)) {
            throw new AppException("Completed pickup assignment is required before warehouse confirmation.", HttpStatus.BAD_REQUEST);
        }
        if (warehouseRecordRepository.existsByOrderId(order.getId())) {
            throw new AppException("Warehouse record already exists for this order.", HttpStatus.CONFLICT);
        }
        if (request == null) {
            throw new AppException("Warehouse arrival details are required.", HttpStatus.BAD_REQUEST);
        }
        requireText(request.getParcelCondition(), "Parcel condition is required.");
        requireText(request.getStorageZone(), "Storage zone is required.");
    }

    private WarehouseRecord createWarehouseRecord(Order order, ConfirmWarehouseArrivalRequest request, User staff) {
        WarehouseRecord record = new WarehouseRecord();
        record.setOrder(order);
        record.setReceivedByUser(staff);
        record.setParcelCondition(clean(request.getParcelCondition()));
        record.setStorageZone(clean(request.getStorageZone()));
        record.setStorageRack(clean(request.getStorageRack()));
        record.setNotes(clean(request.getNotes()));
        record.setReceivedAt(LocalDateTime.now());
        return warehouseRecordRepository.save(record);
    }

    private WarehouseOrderDetailResponse buildDetail(Order order, WarehouseRecord record, Assignment pickupAssignment) {
        List<OrderTimelineResponse> timeline = orderStatusHistoryRepository.findByOrderIdOrderByCreatedAtAsc(order.getId()).stream()
                .map(OrderTimelineResponse::new)
                .toList();
        return new WarehouseOrderDetailResponse(order, record, pickupAssignment, timeline);
    }

    private Order findOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException("Order not found.", HttpStatus.NOT_FOUND));
    }

    private Assignment latestPickupAssignment(Long orderId) {
        return assignmentRepository.findFirstByOrderIdAndAssignmentTypeOrderByAssignedAtDesc(orderId, AssignmentType.PICKUP)
                .orElse(null);
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

    private void notifyAdmins(String trackingNumber) {
        userRepository.findByRole_Code(RoleCode.ADMIN)
                .forEach(admin -> createNotification(
                        admin,
                        "Parcel ready for dispatch",
                        "Order " + trackingNumber + " is ready for driver assignment.",
                        NotificationType.ORDER_STATUS
                ));
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
