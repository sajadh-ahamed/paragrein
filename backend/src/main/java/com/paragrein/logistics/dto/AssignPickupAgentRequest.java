package com.paragrein.logistics.dto;

public class AssignPickupAgentRequest {

    private Long pickupAgentUserId;
    private String note;

    public Long getPickupAgentUserId() {
        return pickupAgentUserId;
    }

    public void setPickupAgentUserId(Long pickupAgentUserId) {
        this.pickupAgentUserId = pickupAgentUserId;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
