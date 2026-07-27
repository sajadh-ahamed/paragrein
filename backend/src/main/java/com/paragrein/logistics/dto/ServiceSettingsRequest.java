package com.paragrein.logistics.dto;

import java.math.BigDecimal;

public class ServiceSettingsRequest {

    private BigDecimal baseRate;
    private BigDecimal perKmRate;
    private BigDecimal advancePercentage;

    public BigDecimal getBaseRate() {
        return baseRate;
    }

    public void setBaseRate(BigDecimal baseRate) {
        this.baseRate = baseRate;
    }

    public BigDecimal getPerKmRate() {
        return perKmRate;
    }

    public void setPerKmRate(BigDecimal perKmRate) {
        this.perKmRate = perKmRate;
    }

    public BigDecimal getAdvancePercentage() {
        return advancePercentage;
    }

    public void setAdvancePercentage(BigDecimal advancePercentage) {
        this.advancePercentage = advancePercentage;
    }
}
