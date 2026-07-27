package com.paragrein.logistics.dto;

public class ConfirmWarehouseArrivalRequest {

    private String parcelCondition;
    private String storageZone;
    private String storageRack;
    private String notes;

    public String getParcelCondition() {
        return parcelCondition;
    }

    public void setParcelCondition(String parcelCondition) {
        this.parcelCondition = parcelCondition;
    }

    public String getStorageZone() {
        return storageZone;
    }

    public void setStorageZone(String storageZone) {
        this.storageZone = storageZone;
    }

    public String getStorageRack() {
        return storageRack;
    }

    public void setStorageRack(String storageRack) {
        this.storageRack = storageRack;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
