package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.Payment;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import com.paragrein.logistics.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AdminOrderDetailResponse extends AdminOrderSummaryResponse {

    private String customerPhone;
    private String senderName;
    private String senderPhone;
    private String senderAddress;
    private String receiverPhone;
    private String receiverAddress;
    private String pickupAddress;
    private String dropoffAddress;
    private String parcelDescription;
    private BigDecimal parcelWeightKg;
    private BigDecimal routeDistanceKm;
    private BigDecimal baseRate;
    private BigDecimal perKmRate;
    private BigDecimal balanceAmount;
    private String paymentReference;
    private PaymentStatus paymentStatus;
    private LocalDateTime paymentSubmittedAt;
    private List<OrderTimelineResponse> timeline;
    private boolean pickupAssignable;
    private boolean driverAssignable;

    public AdminOrderDetailResponse(Order order, Payment payment, List<OrderTimelineResponse> timeline) {
        this(order, payment, timeline, false);
    }

    public AdminOrderDetailResponse(Order order, Payment payment, List<OrderTimelineResponse> timeline,
            boolean activeDeliveryAssignmentExists) {
        super(order);
        this.customerPhone = order.getCustomer().getPhoneNumber();
        this.senderName = order.getSenderName();
        this.senderPhone = order.getSenderPhone();
        this.senderAddress = order.getSenderAddress();
        this.receiverPhone = order.getReceiverPhone();
        this.receiverAddress = order.getReceiverAddress();
        this.pickupAddress = order.getPickupAddress();
        this.dropoffAddress = order.getDropoffAddress();
        this.parcelDescription = order.getParcelDescription();
        this.parcelWeightKg = order.getParcelWeightKg();
        this.routeDistanceKm = order.getRouteDistanceKm();
        this.baseRate = order.getBaseRate();
        this.perKmRate = order.getPerKmRate();
        this.balanceAmount = order.getBalanceAmount();
        this.paymentReference = payment == null ? null : payment.getPaymentReference();
        this.paymentStatus = payment == null ? null : payment.getPaymentStatus();
        this.paymentSubmittedAt = payment == null ? null : payment.getCreatedAt();
        this.timeline = timeline;
        this.pickupAssignable = order.getFinancialStatus() == FinancialStatus.ADVANCE_VERIFIED
                && order.getOrderStatus() == OrderStatus.PENDING_ADVANCE_VERIFICATION;
        this.driverAssignable = order.getOrderStatus() == OrderStatus.READY_FOR_DISPATCH
                && !activeDeliveryAssignmentExists;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public String getSenderName() {
        return senderName;
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

    public String getPickupAddress() {
        return pickupAddress;
    }

    public String getDropoffAddress() {
        return dropoffAddress;
    }

    public String getParcelDescription() {
        return parcelDescription;
    }

    public BigDecimal getParcelWeightKg() {
        return parcelWeightKg;
    }

    public BigDecimal getRouteDistanceKm() {
        return routeDistanceKm;
    }

    public BigDecimal getBaseRate() {
        return baseRate;
    }

    public BigDecimal getPerKmRate() {
        return perKmRate;
    }

    public BigDecimal getBalanceAmount() {
        return balanceAmount;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public LocalDateTime getPaymentSubmittedAt() {
        return paymentSubmittedAt;
    }

    public List<OrderTimelineResponse> getTimeline() {
        return timeline;
    }

    public boolean isPickupAssignable() {
        return pickupAssignable;
    }

    public boolean isDriverAssignable() {
        return driverAssignable;
    }
}
