package com.paragrein.logistics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CostPreviewResponse {

    private String pickupAreaName;
    private String dropoffAreaName;
    private BigDecimal routeDistanceKm;
    private BigDecimal baseRate;
    private BigDecimal perKmRate;
    private BigDecimal advancePercentage;
    private BigDecimal totalAmount;
    private BigDecimal advanceAmount;
    private BigDecimal balanceAmount;
}
