package com.paragrein.logistics.dto;

import java.math.BigDecimal;

public class CompleteDeliveryRequest {

    private String recipientName;
    private BigDecimal balanceCollectedAmount;
    private String deliveryNotes;
    private String proofImagePath;

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public BigDecimal getBalanceCollectedAmount() {
        return balanceCollectedAmount;
    }

    public void setBalanceCollectedAmount(BigDecimal balanceCollectedAmount) {
        this.balanceCollectedAmount = balanceCollectedAmount;
    }

    public String getDeliveryNotes() {
        return deliveryNotes;
    }

    public void setDeliveryNotes(String deliveryNotes) {
        this.deliveryNotes = deliveryNotes;
    }

    public String getProofImagePath() {
        return proofImagePath;
    }

    public void setProofImagePath(String proofImagePath) {
        this.proofImagePath = proofImagePath;
    }
}
