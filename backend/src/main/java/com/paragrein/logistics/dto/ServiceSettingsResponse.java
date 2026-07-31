package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.ServiceSetting;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceSettingsResponse {

    private Long id;
    private BigDecimal baseRate;
    private BigDecimal perKmRate;
    private BigDecimal advancePercentage;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
//    private BigDecimal perKgRate;

    public ServiceSettingsResponse(ServiceSetting serviceSetting) {
        this.id = serviceSetting.getId();
        this.baseRate = serviceSetting.getBaseRate();
        this.perKmRate = serviceSetting.getPerKmRate();
        this.advancePercentage = serviceSetting.getAdvancePercentage();
        this.active = serviceSetting.getActive();
        this.createdAt = serviceSetting.getCreatedAt();
        this.updatedAt = serviceSetting.getUpdatedAt();
//        this.perKgRate = serviceSetting.getPerKgRate();
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getBaseRate() {
        return baseRate;
    }

    public BigDecimal getPerKmRate() {
        return perKmRate;
    }

    public BigDecimal getAdvancePercentage() {
        return advancePercentage;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

//    public BigDecimal getPerKgRate() {
//        return perKgRate;
//    }
}
