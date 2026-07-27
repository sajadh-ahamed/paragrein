package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.WarehouseRecord;
import java.time.LocalDateTime;

public class WarehouseRecordResponse {

    private Long id;
    private Long orderId;
    private String trackingNumber;
    private String parcelCondition;
    private String storageZone;
    private String storageRack;
    private String notes;
    private Long receivedByUserId;
    private String receivedByName;
    private String receivedByUsername;
    private LocalDateTime receivedAt;
    private LocalDateTime readyForDispatchAt;

    public WarehouseRecordResponse(WarehouseRecord record) {
        this.id = record.getId();
        this.orderId = record.getOrder().getId();
        this.trackingNumber = record.getOrder().getTrackingNumber();
        this.parcelCondition = record.getParcelCondition();
        this.storageZone = record.getStorageZone();
        this.storageRack = record.getStorageRack();
        this.notes = record.getNotes();
        this.receivedByUserId = record.getReceivedByUser() == null ? null : record.getReceivedByUser().getId();
        this.receivedByName = record.getReceivedByUser() == null ? null : record.getReceivedByUser().getFullName();
        this.receivedByUsername = record.getReceivedByUser() == null ? null : record.getReceivedByUser().getUsername();
        this.receivedAt = record.getReceivedAt();
        this.readyForDispatchAt = record.getReadyForDispatchAt();
    }

    public Long getId() {
        return id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public String getTrackingNumber() {
        return trackingNumber;
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

    public String getNotes() {
        return notes;
    }

    public Long getReceivedByUserId() {
        return receivedByUserId;
    }

    public String getReceivedByName() {
        return receivedByName;
    }

    public String getReceivedByUsername() {
        return receivedByUsername;
    }

    public LocalDateTime getReceivedAt() {
        return receivedAt;
    }

    public LocalDateTime getReadyForDispatchAt() {
        return readyForDispatchAt;
    }
}
