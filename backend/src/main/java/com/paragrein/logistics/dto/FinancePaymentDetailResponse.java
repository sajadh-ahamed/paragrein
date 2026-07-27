package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Payment;
import java.nio.file.Path;
import java.time.LocalDateTime;

public class FinancePaymentDetailResponse extends FinancePaymentSummaryResponse {

    private String customerPhone;
    private String senderName;
    private String senderPhone;
    private String senderAddress;
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String pickupAddress;
    private String dropoffAddress;
    private String parcelDescription;
    private String parcelWeightKg;
    private String routeDistanceKm;
    private String baseRate;
    private String perKmRate;
    private String receiptPath;
    private String receiptFileName;
    private String rejectionReason;
    private String verifiedByUsername;
    private LocalDateTime orderCreatedAt;
    private LocalDateTime orderUpdatedAt;

    public FinancePaymentDetailResponse(Payment payment) {
        super(payment);
        this.customerPhone = payment.getOrder().getCustomer().getPhoneNumber();
        this.senderName = payment.getOrder().getSenderName();
        this.senderPhone = payment.getOrder().getSenderPhone();
        this.senderAddress = payment.getOrder().getSenderAddress();
        this.receiverName = payment.getOrder().getReceiverName();
        this.receiverPhone = payment.getOrder().getReceiverPhone();
        this.receiverAddress = payment.getOrder().getReceiverAddress();
        this.pickupAddress = payment.getOrder().getPickupAddress();
        this.dropoffAddress = payment.getOrder().getDropoffAddress();
        this.parcelDescription = payment.getOrder().getParcelDescription();
        this.parcelWeightKg = payment.getOrder().getParcelWeightKg().toPlainString();
        this.routeDistanceKm = payment.getOrder().getRouteDistanceKm().toPlainString();
        this.baseRate = payment.getOrder().getBaseRate().toPlainString();
        this.perKmRate = payment.getOrder().getPerKmRate().toPlainString();
        this.receiptPath = safeReceiptPath(payment.getReceiptPath());
        this.receiptFileName = receiptFileName(payment.getReceiptPath());
        this.rejectionReason = payment.getRejectionReason();
        this.verifiedByUsername = payment.getVerifiedByUser() == null ? null : payment.getVerifiedByUser().getUsername();
        this.orderCreatedAt = payment.getOrder().getCreatedAt();
        this.orderUpdatedAt = payment.getOrder().getUpdatedAt();
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getSenderPhone() {
        return senderPhone;
    }

    public String getSenderAddress() {
        return senderAddress;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public String getReceiverAddress() {
        return receiverAddress;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public String getDropoffAddress() {
        return dropoffAddress;
    }

    public String getParcelDescription() {
        return parcelDescription;
    }

    public String getParcelWeightKg() {
        return parcelWeightKg;
    }

    public String getRouteDistanceKm() {
        return routeDistanceKm;
    }

    public String getBaseRate() {
        return baseRate;
    }

    public String getPerKmRate() {
        return perKmRate;
    }

    public String getReceiptPath() {
        return receiptPath;
    }

    public String getReceiptFileName() {
        return receiptFileName;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public String getVerifiedByUsername() {
        return verifiedByUsername;
    }

    public LocalDateTime getOrderCreatedAt() {
        return orderCreatedAt;
    }

    public LocalDateTime getOrderUpdatedAt() {
        return orderUpdatedAt;
    }

    private String safeReceiptPath(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.replace("\\", "/");
    }

    private String receiptFileName(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return Path.of(value).getFileName().toString();
    }
}
