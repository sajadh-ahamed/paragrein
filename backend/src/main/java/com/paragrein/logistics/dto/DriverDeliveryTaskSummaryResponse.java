package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DriverDeliveryTaskSummaryResponse {

    private Long assignmentId;
    private Long orderId;
    private String trackingNumber;
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String dropoffAddress;
    private String parcelDescription;
    private BigDecimal balanceAmount;
    private OrderStatus orderStatus;
    private AssignmentStatus assignmentStatus;
    private LocalDateTime assignedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;

    public DriverDeliveryTaskSummaryResponse(Assignment assignment) {
        this.assignmentId = assignment.getId();
        this.orderId = assignment.getOrder().getId();
        this.trackingNumber = assignment.getOrder().getTrackingNumber();
        this.receiverName = assignment.getOrder().getReceiverName();
        this.receiverPhone = assignment.getOrder().getReceiverPhone();
        this.receiverAddress = assignment.getOrder().getReceiverAddress();
        this.dropoffAddress = assignment.getOrder().getDropoffAddress();
        this.parcelDescription = assignment.getOrder().getParcelDescription();
        this.balanceAmount = assignment.getOrder().getBalanceAmount();
        this.orderStatus = assignment.getOrder().getOrderStatus();
        this.assignmentStatus = assignment.getAssignmentStatus();
        this.assignedAt = assignment.getAssignedAt();
        this.acceptedAt = assignment.getAcceptedAt();
        this.completedAt = assignment.getCompletedAt();
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

    public String getReceiverName() {
        return receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public String getReceiverAddress() {
        return receiverAddress;
    }

    public String getDropoffAddress() {
        return dropoffAddress;
    }

    public String getParcelDescription() {
        return parcelDescription;
    }

    public BigDecimal getBalanceAmount() {
        return balanceAmount;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public AssignmentStatus getAssignmentStatus() {
        return assignmentStatus;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public LocalDateTime getAcceptedAt() {
        return acceptedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}
