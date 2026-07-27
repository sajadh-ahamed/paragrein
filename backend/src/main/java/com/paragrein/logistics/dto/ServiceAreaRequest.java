package com.paragrein.logistics.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServiceAreaRequest {

    private String name;
    private String district;
    private BigDecimal distanceToHubKm;
    private Boolean active;
}
