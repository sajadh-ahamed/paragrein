package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.DeliveryConfirmation;
import com.paragrein.logistics.enums.FinancialStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CompletedDeliveryReportResponse {

    private String trackingNumber;
    private String customerName;
    private String receiverName;
    private String driverName;
    private LocalDateTime deliveredAt;
    private BigDecimal totalAmount;
    private BigDecimal advanceAmount;
    private BigDecimal balanceCollected;
    private FinancialStatus financialStatus;

    public CompletedDeliveryReportResponse(DeliveryConfirmation confirmation) {
        this.trackingNumber = confirmation.getOrder().getTrackingNumber();
        this.customerName = confirmation.getOrder().getCustomer().getFullName();
        this.receiverName = confirmation.getOrder().getReceiverName();
        this.driverName = confirmation.getDriverUser().getFullName();
        this.deliveredAt = confirmation.getDeliveredAt();
        this.totalAmount = confirmation.getOrder().getTotalAmount();
        this.advanceAmount = confirmation.getOrder().getAdvanceAmount();
        this.balanceCollected = confirmation.getBalanceCollectedAmount();
        this.financialStatus = confirmation.getOrder().getFinancialStatus();
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

    public String getDriverName() {
        return driverName;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BigDecimal getAdvanceAmount() {
        return advanceAmount;
    }

    public BigDecimal getBalanceCollected() {
        return balanceCollected;
    }

    public FinancialStatus getFinancialStatus() {
        return financialStatus;
    }
}
