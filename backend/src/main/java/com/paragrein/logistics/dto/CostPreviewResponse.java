package com.paragrein.logistics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CostPreviewResponse {

    private String pickupAddress;
    private String dropoffAddress;
    private BigDecimal routeDistanceKm;
    private BigDecimal baseRate;
    private BigDecimal perKmRate;
    private BigDecimal advancePercentage;
    private BigDecimal totalAmount;
    private BigDecimal advanceAmount;
    private BigDecimal balanceAmount;
}
