package com.paragrein.logistics.dto;

import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import java.time.LocalDateTime;

public class PublicTrackingResponse {

    private String trackingNumber;
    private OrderStatus orderStatus;
    private FinancialStatus financialStatus;
    private LocalDateTime lastUpdatedAt;
    private String publicMessage;

    public PublicTrackingResponse(String trackingNumber, OrderStatus orderStatus, FinancialStatus financialStatus, LocalDateTime lastUpdatedAt, String publicMessage) {
        this.trackingNumber = trackingNumber;
        this.orderStatus = orderStatus;
        this.financialStatus = financialStatus;
        this.lastUpdatedAt = lastUpdatedAt;
        this.publicMessage = publicMessage;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public FinancialStatus getFinancialStatus() {
        return financialStatus;
    }

    public LocalDateTime getLastUpdatedAt() {
        return lastUpdatedAt;
    }

    public String getPublicMessage() {
        return publicMessage;
    }
}
