package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.WarehouseRecord;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class WarehouseOrderDetailResponse extends WarehouseOrderSummaryResponse {

    private String customerEmail;
    private String customerPhone;
    private String senderPhone;
    private String senderAddress;
    private String receiverPhone;
    private String receiverAddress;
    private BigDecimal routeDistanceKm;
    private BigDecimal totalAmount;
    private Long pickupAssignmentId;
    private String pickupAgentName;
    private String pickupAgentUsername;
    private LocalDateTime pickupCompletedAt;
    private WarehouseRecordResponse warehouseRecord;
    private List<OrderTimelineResponse> timeline;

    public WarehouseOrderDetailResponse(
            Order order,
            WarehouseRecord record,
            Assignment pickupAssignment,
            List<OrderTimelineResponse> timeline
    ) {
        super(order, record);
        this.customerEmail = order.getCustomer().getEmail();
        this.customerPhone = order.getCustomer().getPhoneNumber();
        this.senderPhone = order.getSenderPhone();
        this.senderAddress = order.getSenderAddress();
        this.receiverPhone = order.getReceiverPhone();
        this.receiverAddress = order.getReceiverAddress();
        this.routeDistanceKm = order.getRouteDistanceKm();
        this.totalAmount = order.getTotalAmount();
        this.pickupAssignmentId = pickupAssignment == null ? null : pickupAssignment.getId();
        this.pickupAgentName = pickupAssignment == null ? null : pickupAssignment.getAssignedToUser().getFullName();
        this.pickupAgentUsername = pickupAssignment == null ? null : pickupAssignment.getAssignedToUser().getUsername();
        this.pickupCompletedAt = pickupAssignment == null ? null : pickupAssignment.getCompletedAt();
        this.warehouseRecord = record == null ? null : new WarehouseRecordResponse(record);
        this.timeline = timeline;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public String getSenderPhone() {
        return senderPhone;
    }

    public String getSenderAddress() {
        return senderAddress;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public String getReceiverAddress() {
        return receiverAddress;
    }

    public BigDecimal getRouteDistanceKm() {
        return routeDistanceKm;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public Long getPickupAssignmentId() {
        return pickupAssignmentId;
    }

    public String getPickupAgentName() {
        return pickupAgentName;
    }

    public String getPickupAgentUsername() {
        return pickupAgentUsername;
    }

    public LocalDateTime getPickupCompletedAt() {
        return pickupCompletedAt;
    }

    @Override
    public WarehouseRecordResponse getWarehouseRecord() {
        return warehouseRecord;
    }

    public List<OrderTimelineResponse> getTimeline() {
        return timeline;
    }
}
