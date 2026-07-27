package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.OrderStatus;
import java.time.LocalDateTime;

public class DeliveryAssignmentResponse {

    private Long assignmentId;
    private Long orderId;
    private String trackingNumber;
    private String driverName;
    private String driverUsername;
    private String assignedByUsername;
    private AssignmentStatus assignmentStatus;
    private OrderStatus orderStatus;
    private LocalDateTime assignedAt;

    public DeliveryAssignmentResponse(Assignment assignment) {
        this.assignmentId = assignment.getId();
        this.orderId = assignment.getOrder().getId();
        this.trackingNumber = assignment.getOrder().getTrackingNumber();
        this.driverName = assignment.getAssignedToUser().getFullName();
        this.driverUsername = assignment.getAssignedToUser().getUsername();
        this.assignedByUsername = assignment.getAssignedByUser() == null ? null : assignment.getAssignedByUser().getUsername();
        this.assignmentStatus = assignment.getAssignmentStatus();
        this.orderStatus = assignment.getOrder().getOrderStatus();
        this.assignedAt = assignment.getAssignedAt();
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public String getDriverName() {
        return driverName;
    }

    public String getDriverUsername() {
        return driverUsername;
    }

    public String getAssignedByUsername() {
        return assignedByUsername;
    }

    public AssignmentStatus getAssignmentStatus() {
        return assignmentStatus;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }
}
