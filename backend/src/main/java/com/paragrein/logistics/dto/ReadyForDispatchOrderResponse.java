package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.WarehouseRecord;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReadyForDispatchOrderResponse {

    private Long id;
    private String trackingNumber;
    private String customerName;
    private String receiverName;
    private String dropoffAddress;
    private String parcelDescription;
    private String storageZone;
    private String storageRack;
    private LocalDateTime readyForDispatchAt;
    private BigDecimal totalAmount;
    private BigDecimal balanceAmount;
    private OrderStatus orderStatus;
    private FinancialStatus financialStatus;

    public ReadyForDispatchOrderResponse(WarehouseRecord record) {
        Order order = record.getOrder();
        this.id = order.getId();
        this.trackingNumber = order.getTrackingNumber();
        this.customerName = order.getCustomer().getFullName();
        this.receiverName = order.getReceiverName();
        this.dropoffAddress = order.getDropoffAddress();
        this.parcelDescription = order.getParcelDescription();
        this.storageZone = record.getStorageZone();
        this.storageRack = record.getStorageRack();
        this.readyForDispatchAt = record.getReadyForDispatchAt();
        this.totalAmount = order.getTotalAmount();
        this.balanceAmount = order.getBalanceAmount();
        this.orderStatus = order.getOrderStatus();
        this.financialStatus = order.getFinancialStatus();
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

    public String getReceiverName() {
        return receiverName;
    }

    public String getDropoffAddress() {
        return dropoffAddress;
    }

    public String getParcelDescription() {
        return parcelDescription;
    }

    public String getStorageZone() {
        return storageZone;
    }

    public String getStorageRack() {
        return storageRack;
    }

    public LocalDateTime getReadyForDispatchAt() {
        return readyForDispatchAt;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BigDecimal getBalanceAmount() {
        return balanceAmount;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public FinancialStatus getFinancialStatus() {
        return financialStatus;
    }
}
