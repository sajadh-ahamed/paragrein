package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PickupTaskSummaryResponse {

    private Long assignmentId;
    private Long orderId;
    private String trackingNumber;
    private String senderName;
    private String senderPhone;
    private String pickupAddress;
    private String receiverName;
    private String dropoffAddress;
    private String parcelDescription;
    private BigDecimal parcelWeightKg;
    private OrderStatus orderStatus;
    private AssignmentStatus assignmentStatus;
    private LocalDateTime assignedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;

    public PickupTaskSummaryResponse(Assignment assignment) {
        this.assignmentId = assignment.getId();
        this.orderId = assignment.getOrder().getId();
        this.trackingNumber = assignment.getOrder().getTrackingNumber();
        this.senderName = assignment.getOrder().getSenderName();
        this.senderPhone = assignment.getOrder().getSenderPhone();
        this.pickupAddress = assignment.getOrder().getPickupAddress();
        this.dropoffAddress = assignment.getOrder().getDropoffAddress();
        this.receiverName = assignment.getOrder().getReceiverName();
        this.parcelDescription = assignment.getOrder().getParcelDescription();
        this.parcelWeightKg = assignment.getOrder().getParcelWeightKg();
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

    public String getSenderName() {
        return senderName;
    }

    public String getSenderPhone() {
        return senderPhone;
    }

    public String getPickupAreaName() {
        return pickupAddress;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public String getDropoffAreaName() {
        return dropoffAddress;
    }

    public String getParcelDescription() {
        return parcelDescription;
    }

    public BigDecimal getParcelWeightKg() {
        return parcelWeightKg;
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
