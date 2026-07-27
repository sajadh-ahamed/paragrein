package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.DeliveryConfirmation;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DeliveryConfirmationResponse {

    private Long id;
    private String recipientName;
    private BigDecimal balanceCollectedAmount;
    private String proofImagePath;
    private String deliveryNotes;
    private LocalDateTime reachedDestinationAt;
    private LocalDateTime deliveredAt;

    public DeliveryConfirmationResponse(DeliveryConfirmation confirmation) {
        this.id = confirmation.getId();
        this.recipientName = confirmation.getRecipientName();
        this.balanceCollectedAmount = confirmation.getBalanceCollectedAmount();
        this.proofImagePath = confirmation.getProofImagePath();
        this.deliveryNotes = confirmation.getDeliveryNotes();
        this.reachedDestinationAt = confirmation.getReachedDestinationAt();
        this.deliveredAt = confirmation.getDeliveredAt();
    }

    public Long getId() {
        return id;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public BigDecimal getBalanceCollectedAmount() {
        return balanceCollectedAmount;
    }

    public String getProofImagePath() {
        return proofImagePath;
    }

    public String getDeliveryNotes() {
        return deliveryNotes;
    }

    public LocalDateTime getReachedDestinationAt() {
        return reachedDestinationAt;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }
}
