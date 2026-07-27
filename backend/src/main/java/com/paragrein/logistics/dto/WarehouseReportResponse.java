package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.WarehouseRecord;
import com.paragrein.logistics.enums.OrderStatus;
import java.time.LocalDateTime;

public class WarehouseReportResponse {

    private String trackingNumber;
    private String parcelDescription;
    private String parcelCondition;
    private String storageZone;
    private String storageRack;
    private String receivedBy;
    private LocalDateTime receivedAt;
    private LocalDateTime readyForDispatchAt;
    private OrderStatus orderStatus;

    public WarehouseReportResponse(WarehouseRecord record) {
        this.trackingNumber = record.getOrder().getTrackingNumber();
        this.parcelDescription = record.getOrder().getParcelDescription();
        this.parcelCondition = record.getParcelCondition();
        this.storageZone = record.getStorageZone();
        this.storageRack = record.getStorageRack();
        this.receivedBy = record.getReceivedByUser() == null ? "System" : record.getReceivedByUser().getFullName();
        this.receivedAt = record.getReceivedAt();
        this.readyForDispatchAt = record.getReadyForDispatchAt();
        this.orderStatus = record.getOrder().getOrderStatus();
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public String getParcelDescription() {
        return parcelDescription;
    }

    public String getParcelCondition() {
        return parcelCondition;
    }

    public String getStorageZone() {
        return storageZone;
    }

    public String getStorageRack() {
        return storageRack;
    }

    public String getReceivedBy() {
        return receivedBy;
    }

    public LocalDateTime getReceivedAt() {
        return receivedAt;
    }

    public LocalDateTime getReadyForDispatchAt() {
        return readyForDispatchAt;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }
}
