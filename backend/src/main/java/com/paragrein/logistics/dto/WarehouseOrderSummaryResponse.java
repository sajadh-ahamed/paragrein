package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.WarehouseRecord;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WarehouseOrderSummaryResponse {

    private Long id;
    private String trackingNumber;
    private String customerName;
    private String senderName;
    private String receiverName;
    private String parcelDescription;
    private BigDecimal parcelWeightKg;
    private String pickupAddress;
    private String dropoffAddress;
    private OrderStatus orderStatus;
    private FinancialStatus financialStatus;
    private LocalDateTime updatedAt;
    private WarehouseRecordResponse warehouseRecord;

    public WarehouseOrderSummaryResponse(Order order) {
        this(order, null);
    }

    public WarehouseOrderSummaryResponse(Order order, WarehouseRecord record) {
        this.id = order.getId();
        this.trackingNumber = order.getTrackingNumber();
        this.customerName = order.getCustomer().getFullName();
        this.senderName = order.getSenderName();
        this.receiverName = order.getReceiverName();
        this.parcelDescription = order.getParcelDescription();
        this.parcelWeightKg = order.getParcelWeightKg();
        this.pickupAddress = order.getPickupAddress();
        this.dropoffAddress = order.getDropoffAddress();
        this.orderStatus = order.getOrderStatus();
        this.financialStatus = order.getFinancialStatus();
        this.updatedAt = order.getUpdatedAt();
        this.warehouseRecord = record == null ? null : new WarehouseRecordResponse(record);
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

    public String getSenderName() {
        return senderName;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public String getParcelDescription() {
        return parcelDescription;
    }

    public BigDecimal getParcelWeightKg() {
        return parcelWeightKg;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public WarehouseRecordResponse getWarehouseRecord() {
        return warehouseRecord;
    }
}
