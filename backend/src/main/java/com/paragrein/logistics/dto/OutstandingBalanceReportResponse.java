package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import java.math.BigDecimal;

public class OutstandingBalanceReportResponse {

    private Long orderId;
    private String trackingNumber;
    private String customerName;
    private BigDecimal totalAmount;
    private BigDecimal advanceAmount;
    private BigDecimal balanceAmount;
    private FinancialStatus financialStatus;
    private OrderStatus orderStatus;

    public OutstandingBalanceReportResponse(Order order) {
        this.orderId = order.getId();
        this.trackingNumber = order.getTrackingNumber();
        this.customerName = order.getCustomer().getFullName();
        this.totalAmount = order.getTotalAmount();
        this.advanceAmount = order.getAdvanceAmount();
        this.balanceAmount = order.getBalanceAmount();
        this.financialStatus = order.getFinancialStatus();
        this.orderStatus = order.getOrderStatus();
    }

    public Long getOrderId() {
        return orderId;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BigDecimal getAdvanceAmount() {
        return advanceAmount;
    }

    public BigDecimal getBalanceAmount() {
        return balanceAmount;
    }

    public FinancialStatus getFinancialStatus() {
        return financialStatus;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }
}
