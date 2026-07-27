package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.OrderTimelineResponse;
import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.AssignmentType;
import com.paragrein.logistics.enums.OrderStatus;
import com.paragrein.logistics.enums.RoleCode;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AssignmentRepository;
import com.paragrein.logistics.repository.OrderRepository;
import com.paragrein.logistics.repository.OrderStatusHistoryRepository;
import com.paragrein.logistics.security.SecurityUserUtil;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderHistoryService {

    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final AssignmentRepository assignmentRepository;

    public OrderHistoryService(
            OrderRepository orderRepository,
            OrderStatusHistoryRepository orderStatusHistoryRepository,
            AssignmentRepository assignmentRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderTimelineResponse> getStatusHistory(Long orderId, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException("Order not found.", HttpStatus.NOT_FOUND));
        if (!canViewOrderHistory(user, order)) {
            throw new AppException("You are not allowed to view this order history.", HttpStatus.FORBIDDEN);
        }
        return orderStatusHistoryRepository.findByOrderIdOrderByCreatedAtAsc(order.getId()).stream()
                .map(OrderTimelineResponse::new)
                .toList();
    }

    private boolean canViewOrderHistory(User user, Order order) {
        RoleCode role = user.getRole().getCode();
        if (role == RoleCode.ADMIN || role == RoleCode.FINANCE_OFFICER) {
            return true;
        }
        if (role == RoleCode.CUSTOMER) {
            return order.getCustomer().getId().equals(user.getId());
        }
        if (role == RoleCode.PICKUP_AGENT) {
            return hasAssignment(order.getId(), user.getId(), AssignmentType.PICKUP);
        }
        if (role == RoleCode.DRIVER) {
            return hasAssignment(order.getId(), user.getId(), AssignmentType.DELIVERY);
        }
        return role == RoleCode.WAREHOUSE_STAFF && isWarehouseVisible(order.getOrderStatus());
    }

    private boolean hasAssignment(Long orderId, Long userId, AssignmentType assignmentType) {
        return assignmentRepository.findByAssignmentTypeAndAssignedToUserIdOrderByAssignedAtDesc(assignmentType, userId).stream()
                .anyMatch(assignment -> assignment.getOrder().getId().equals(orderId)
                        && assignment.getAssignmentStatus() != AssignmentStatus.CANCELLED);
    }

    private boolean isWarehouseVisible(OrderStatus status) {
        return List.of(
                OrderStatus.ARRIVED_AT_WAREHOUSE,
                OrderStatus.WAREHOUSE_PROCESSING,
                OrderStatus.READY_FOR_DISPATCH,
                OrderStatus.ASSIGNED_TO_DELIVERY,
                OrderStatus.DELIVERY_ACCEPTED,
                OrderStatus.REACHED_DESTINATION,
                OrderStatus.DELIVERED
        ).contains(status);
    }
}
