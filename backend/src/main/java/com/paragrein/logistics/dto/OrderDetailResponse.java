package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.Payment;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import com.paragrein.logistics.enums.PaymentStatus;
import com.paragrein.logistics.enums.PaymentType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class OrderDetailResponse {

    private Long id;
    private String trackingNumber;
    private String senderName;
    private String senderPhone;
    private String senderAddress;
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String pickupAddress;
    private String dropoffAddress;
    private String parcelDescription;
    private BigDecimal parcelWeightKg;
    private BigDecimal routeDistanceKm;
    private BigDecimal baseRate;
    private BigDecimal perKmRate;
    private BigDecimal totalAmount;
    private BigDecimal advanceAmount;
    private BigDecimal balanceAmount;
    private OrderStatus orderStatus;
    private FinancialStatus financialStatus;
    private String paymentReference;
    private String receiptPath;
    private PaymentType paymentType;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderTimelineResponse> timeline;

    public OrderDetailResponse(Order order, Payment payment, List<OrderTimelineResponse> timeline) {
        this.id = order.getId();
        this.trackingNumber = order.getTrackingNumber();
        this.senderName = order.getSenderName();
        this.senderPhone = order.getSenderPhone();
        this.senderAddress = order.getSenderAddress();
        this.receiverName = order.getReceiverName();
        this.receiverPhone = order.getReceiverPhone();
        this.receiverAddress = order.getReceiverAddress();
        this.pickupAddress = order.getPickupAddress();
        this.dropoffAddress = order.getDropoffAddress();
        this.parcelDescription = order.getParcelDescription();
        this.parcelWeightKg = order.getParcelWeightKg();
        this.routeDistanceKm = order.getRouteDistanceKm();
        this.baseRate = order.getBaseRate();
        this.perKmRate = order.getPerKmRate();
        this.totalAmount = order.getTotalAmount();
        this.advanceAmount = order.getAdvanceAmount();
        this.balanceAmount = order.getBalanceAmount();
        this.orderStatus = order.getOrderStatus();
        this.financialStatus = order.getFinancialStatus();
        this.createdAt = order.getCreatedAt();
        this.updatedAt = order.getUpdatedAt();
        this.timeline = timeline;
        if (payment != null) {
            this.paymentReference = payment.getPaymentReference();
            this.receiptPath = payment.getReceiptPath();
            this.paymentType = payment.getPaymentType();
            this.paymentStatus = payment.getPaymentStatus();
        }
    }
}
