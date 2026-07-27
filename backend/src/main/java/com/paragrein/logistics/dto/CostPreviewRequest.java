package com.paragrein.logistics.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CostPreviewRequest {

    @NotNull(message = "Route distance is required.")
    @DecimalMin(value = "0.01", message = "Route distance must be greater than 0.")
    private BigDecimal routeDistanceKm;

    @NotNull(message = "Parcel weight is required.")
    @DecimalMin(value = "0.01", message = "Parcel weight must be greater than 0.")
    private BigDecimal parcelWeightKg;
}
