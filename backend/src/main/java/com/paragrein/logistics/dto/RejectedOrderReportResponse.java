package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.Payment;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import java.time.LocalDateTime;

public class RejectedOrderReportResponse {

    private String trackingNumber;
    private String customerName;
    private OrderStatus orderStatus;
    private FinancialStatus financialStatus;
    private String rejectionReason;
    private LocalDateTime createdAt;

    public RejectedOrderReportResponse(Order order, Payment rejectedPayment) {
        this.trackingNumber = order.getTrackingNumber();
        this.customerName = order.getCustomer().getFullName();
        this.orderStatus = order.getOrderStatus();
        this.financialStatus = order.getFinancialStatus();
        this.rejectionReason = rejectedPayment == null ? null : rejectedPayment.getRejectionReason();
        this.createdAt = order.getCreatedAt();
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public FinancialStatus getFinancialStatus() {
        return financialStatus;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
