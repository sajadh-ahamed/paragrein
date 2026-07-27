package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderSummaryResponse {

    private Long id;
    private String trackingNumber;
    private String receiverName;
    private String pickupAddress;
    private String dropoffAddress;
    private OrderStatus orderStatus;
    private FinancialStatus financialStatus;
    private BigDecimal totalAmount;
    private BigDecimal advanceAmount;
    private BigDecimal balanceAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderSummaryResponse(Order order) {
        this.id = order.getId();
        this.trackingNumber = order.getTrackingNumber();
        this.receiverName = order.getReceiverName();
        this.pickupAddress = order.getPickupAddress();
        this.dropoffAddress = order.getDropoffAddress();
        this.orderStatus = order.getOrderStatus();
        this.financialStatus = order.getFinancialStatus();
        this.totalAmount = order.getTotalAmount();
        this.advanceAmount = order.getAdvanceAmount();
        this.balanceAmount = order.getBalanceAmount();
        this.createdAt = order.getCreatedAt();
        this.updatedAt = order.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public String getDropoffAddress() {
        return dropoffAddress;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public FinancialStatus getFinancialStatus() {
        return financialStatus;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BigDecimal getAdvanceAmount() {
        return advanceAmount;
    }

    public BigDecimal getBalanceAmount() {
        return balanceAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
