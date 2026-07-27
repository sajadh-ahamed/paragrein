package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.entity.Payment;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import com.paragrein.logistics.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FinancePaymentSummaryResponse {

    private Long paymentId;
    private Long orderId;
    private String trackingNumber;
    private String customerName;
    private String customerEmail;
    private String paymentReference;
    private BigDecimal advanceAmount;
    private BigDecimal totalAmount;
    private BigDecimal balanceAmount;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private FinancialStatus financialStatus;
    private LocalDateTime submittedAt;
    private LocalDateTime verifiedAt;

    public FinancePaymentSummaryResponse(Payment payment) {
        this(payment.getOrder(), payment);
    }

    public FinancePaymentSummaryResponse(Order order, Payment payment) {
        this.paymentId = payment == null ? null : payment.getId();
        this.orderId = order.getId();
        this.trackingNumber = order.getTrackingNumber();
        this.customerName = order.getCustomer().getFullName();
        this.customerEmail = order.getCustomer().getEmail();
        this.paymentReference = payment == null ? "Payment record not available" : payment.getPaymentReference();
        this.advanceAmount = payment == null ? order.getAdvanceAmount() : payment.getAmount();
        this.totalAmount = order.getTotalAmount();
        this.balanceAmount = order.getBalanceAmount();
        this.paymentStatus = payment == null ? null : payment.getPaymentStatus();
        this.orderStatus = order.getOrderStatus();
        this.financialStatus = order.getFinancialStatus();
        this.submittedAt = payment == null ? order.getCreatedAt() : payment.getCreatedAt();
        this.verifiedAt = payment == null ? null : payment.getVerifiedAt();
    }

    public Long getPaymentId() {
        return paymentId;
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

    public String getCustomerEmail() {
        return customerEmail;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public BigDecimal getAdvanceAmount() {
        return advanceAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BigDecimal getBalanceAmount() {
        return balanceAmount;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public FinancialStatus getFinancialStatus() {
        return financialStatus;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }
}
