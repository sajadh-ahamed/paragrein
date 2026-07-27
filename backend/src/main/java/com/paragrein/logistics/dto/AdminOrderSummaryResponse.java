package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminOrderSummaryResponse {

    private Long id;
    private String trackingNumber;
    private String customerName;
    private String customerEmail;
    private String receiverName;
    private String pickupAddress;
    private String dropoffAddress;
    private BigDecimal totalAmount;
    private BigDecimal advanceAmount;
    private OrderStatus orderStatus;
    private FinancialStatus financialStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdminOrderSummaryResponse(Order order) {
        this.id = order.getId();
        this.trackingNumber = order.getTrackingNumber();
        this.customerName = order.getCustomer().getFullName();
        this.customerEmail = order.getCustomer().getEmail();
        this.receiverName = order.getReceiverName();
        this.pickupAddress = order.getPickupAddress();
        this.dropoffAddress = order.getDropoffAddress();
        this.totalAmount = order.getTotalAmount();
        this.advanceAmount = order.getAdvanceAmount();
        this.orderStatus = order.getOrderStatus();
        this.financialStatus = order.getFinancialStatus();
        this.createdAt = order.getCreatedAt();
        this.updatedAt = order.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public String getPickupAreaName() {
        return pickupAddress;
    }

    public String getDropoffAreaName() {
        return dropoffAddress;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BigDecimal getAdvanceAmount() {
        return advanceAmount;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public FinancialStatus getFinancialStatus() {
        return financialStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
