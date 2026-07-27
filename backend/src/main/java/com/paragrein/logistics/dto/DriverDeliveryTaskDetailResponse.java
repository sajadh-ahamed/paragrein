package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.entity.DeliveryConfirmation;
import java.math.BigDecimal;
import java.util.List;

public class DriverDeliveryTaskDetailResponse extends DriverDeliveryTaskSummaryResponse {

    private String senderName;
    private String senderPhone;
    private String pickupAddress;
    private String customerName;
    private String customerPhone;
    private BigDecimal totalAmount;
    private BigDecimal advanceAmount;
    private BigDecimal parcelWeightKg;
    private DeliveryConfirmationResponse deliveryConfirmation;
    private List<OrderTimelineResponse> timeline;

    public DriverDeliveryTaskDetailResponse(Assignment assignment, DeliveryConfirmation confirmation, List<OrderTimelineResponse> timeline) {
        super(assignment);
        this.senderName = assignment.getOrder().getSenderName();
        this.senderPhone = assignment.getOrder().getSenderPhone();
        this.pickupAddress = assignment.getOrder().getPickupAddress();
        this.customerName = assignment.getOrder().getCustomer().getFullName();
        this.customerPhone = assignment.getOrder().getCustomer().getPhoneNumber();
        this.totalAmount = assignment.getOrder().getTotalAmount();
        this.advanceAmount = assignment.getOrder().getAdvanceAmount();
        this.parcelWeightKg = assignment.getOrder().getParcelWeightKg();
        this.deliveryConfirmation = confirmation == null ? null : new DeliveryConfirmationResponse(confirmation);
        this.timeline = timeline;
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

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BigDecimal getAdvanceAmount() {
        return advanceAmount;
    }

    public BigDecimal getParcelWeightKg() {
        return parcelWeightKg;
    }

    public DeliveryConfirmationResponse getDeliveryConfirmation() {
        return deliveryConfirmation;
    }

    public List<OrderTimelineResponse> getTimeline() {
        return timeline;
    }
}
