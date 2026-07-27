package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.AdminDashboardSummaryResponse;
import com.paragrein.logistics.dto.AdminOrderDetailResponse;
import com.paragrein.logistics.dto.AdminOrderSummaryResponse;
import com.paragrein.logistics.dto.OrderTimelineResponse;
import com.paragrein.logistics.dto.ReadyForDispatchOrderResponse;
import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.Payment;
import com.paragrein.logistics.enums.AccountStatus;
import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.AssignmentType;
import com.paragrein.logistics.enums.AvailabilityStatus;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import com.paragrein.logistics.enums.RoleCode;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AssignmentRepository;
import com.paragrein.logistics.repository.EmployeeProfileRepository;
import com.paragrein.logistics.repository.OrderRepository;
import com.paragrein.logistics.repository.OrderStatusHistoryRepository;
import com.paragrein.logistics.repository.PaymentRepository;
import com.paragrein.logistics.repository.WarehouseRecordRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminDashboardService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final AssignmentRepository assignmentRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final WarehouseRecordRepository warehouseRecordRepository;

    public AdminDashboardService(
            OrderRepository orderRepository,
            PaymentRepository paymentRepository,
            OrderStatusHistoryRepository orderStatusHistoryRepository,
            AssignmentRepository assignmentRepository,
            EmployeeProfileRepository employeeProfileRepository,
            WarehouseRecordRepository warehouseRecordRepository
    ) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.assignmentRepository = assignmentRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.warehouseRecordRepository = warehouseRecordRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardSummaryResponse getAdminDashboardSummary() {
        var startOfDay = LocalDate.now().atStartOfDay();

        return new AdminDashboardSummaryResponse(
                orderRepository.countByFinancialStatus(FinancialStatus.ADVANCE_SUBMITTED),
                orderRepository.countByFinancialStatusUpdatedToday(FinancialStatus.ADVANCE_VERIFIED, startOfDay),
                orderRepository.countByFinancialStatus(FinancialStatus.ADVANCE_SUBMITTED),
                employeeProfileRepository.countByUser_AccountStatus(AccountStatus.ACTIVE),
                orderRepository.countByFinancialStatusAndOrderStatus(FinancialStatus.ADVANCE_VERIFIED, OrderStatus.PENDING_ADVANCE_VERIFICATION),
                assignmentRepository.countByAssignmentTypeAndAssignmentStatusIn(AssignmentType.PICKUP, List.of(AssignmentStatus.ASSIGNED, AssignmentStatus.ACCEPTED)),
                orderRepository.countByOrderStatus(OrderStatus.ARRIVED_AT_WAREHOUSE),
                orderRepository.countByOrderStatus(OrderStatus.DELIVERED),
                orderRepository.countByOrderStatus(OrderStatus.READY_FOR_DISPATCH),
                assignmentRepository.countByAssignmentTypeAndAssignmentStatusIn(AssignmentType.DELIVERY, List.of(AssignmentStatus.ASSIGNED, AssignmentStatus.ACCEPTED)),
                employeeProfileRepository.findByUser_Role_CodeAndUser_AccountStatusAndAvailabilityStatus(
                        RoleCode.DRIVER,
                        AccountStatus.ACTIVE,
                        AvailabilityStatus.AVAILABLE
                ).size()
        );
    }

    @Transactional(readOnly = true)
    public List<AdminOrderSummaryResponse> getLatestOrders() {
        return orderRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(AdminOrderSummaryResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminOrderSummaryResponse> getOrdersReadyForPickupAssignment() {
        return orderRepository.findByFinancialStatusAndOrderStatusOrderByUpdatedAtDesc(
                        FinancialStatus.ADVANCE_VERIFIED,
                        OrderStatus.PENDING_ADVANCE_VERIFICATION
                ).stream()
                .map(AdminOrderSummaryResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReadyForDispatchOrderResponse> getOrdersReadyForDriverAssignment() {
        return warehouseRecordRepository.findByOrder_OrderStatusOrderByReceivedAtDesc(OrderStatus.READY_FOR_DISPATCH).stream()
                .filter(record -> record.getReadyForDispatchAt() != null)
                .map(ReadyForDispatchOrderResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminOrderDetailResponse getAdminOrderDetail(Long orderId) {
        Order order = findOrder(orderId);
        Payment payment = paymentRepository.findByOrderIdOrderByCreatedAtDesc(order.getId()).stream()
                .findFirst()
                .orElse(null);
        List<OrderTimelineResponse> timeline = orderStatusHistoryRepository.findByOrderIdOrderByCreatedAtAsc(order.getId()).stream()
                .map(OrderTimelineResponse::new)
                .toList();
        boolean activeDeliveryAssignmentExists = assignmentRepository.existsByOrderIdAndAssignmentTypeAndAssignmentStatusIn(
                order.getId(),
                AssignmentType.DELIVERY,
                List.of(AssignmentStatus.ASSIGNED, AssignmentStatus.ACCEPTED)
        );
        return new AdminOrderDetailResponse(order, payment, timeline, activeDeliveryAssignmentExists);
    }

    private Order findOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException("Order not found.", HttpStatus.NOT_FOUND));
    }
}
