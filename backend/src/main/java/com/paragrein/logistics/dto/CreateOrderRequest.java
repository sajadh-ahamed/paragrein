package com.paragrein.logistics.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateOrderRequest {

    private String senderName;
    private String senderPhone;
    private String senderAddress;
    private String pickupAddress;
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String dropoffAddress;
    private BigDecimal routeDistanceKm;
    private String parcelDescription;
    private BigDecimal parcelWeightKg;
    private String paymentReference;
    private String receiptPath;
}
