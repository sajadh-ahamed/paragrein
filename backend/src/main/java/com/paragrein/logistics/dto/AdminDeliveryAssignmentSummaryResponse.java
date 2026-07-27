package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.OrderStatus;
import java.time.LocalDateTime;

public class AdminDeliveryAssignmentSummaryResponse {

    private Long assignmentId;
    private Long orderId;
    private String trackingNumber;
    private String customerName;
    private String receiverName;
    private String dropoffAddress;
    private String driverName;
    private String driverUsername;
    private AssignmentStatus assignmentStatus;
    private OrderStatus orderStatus;
    private LocalDateTime assignedAt;

    public AdminDeliveryAssignmentSummaryResponse(Assignment assignment) {
        this.assignmentId = assignment.getId();
        this.orderId = assignment.getOrder().getId();
        this.trackingNumber = assignment.getOrder().getTrackingNumber();
        this.customerName = assignment.getOrder().getCustomer().getFullName();
        this.receiverName = assignment.getOrder().getReceiverName();
        this.dropoffAddress= assignment.getOrder().getDropoffAddress();
        this.driverName = assignment.getAssignedToUser().getFullName();
        this.driverUsername = assignment.getAssignedToUser().getUsername();
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

    public String getCustomerName() {
        return customerName;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public String getDropoffAreaName() {
        return dropoffAddress;
    }

    public String getDriverName() {
        return driverName;
    }

    public String getDriverUsername() {
        return driverUsername;
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
