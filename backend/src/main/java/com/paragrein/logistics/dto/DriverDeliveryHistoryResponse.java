package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.entity.DeliveryConfirmation;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DriverDeliveryHistoryResponse extends DriverDeliveryTaskSummaryResponse {

    private BigDecimal balanceCollectedAmount;
    private LocalDateTime deliveredAt;

    public DriverDeliveryHistoryResponse(Assignment assignment, DeliveryConfirmation confirmation) {
        super(assignment);
        this.balanceCollectedAmount = confirmation == null ? null : confirmation.getBalanceCollectedAmount();
        this.deliveredAt = confirmation == null ? assignment.getCompletedAt() : confirmation.getDeliveredAt();
    }

    public BigDecimal getBalanceCollectedAmount() {
        return balanceCollectedAmount;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }
}
