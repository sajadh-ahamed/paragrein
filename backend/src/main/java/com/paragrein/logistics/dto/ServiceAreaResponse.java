package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.ServiceArea;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceAreaResponse {

    private Long id;
    private String name;
    private String district;
    private BigDecimal distanceToHubKm;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ServiceAreaResponse(ServiceArea serviceArea) {
        this.id = serviceArea.getId();
        this.name = serviceArea.getName();
        this.district = serviceArea.getDistrict();
        this.distanceToHubKm = serviceArea.getDistanceToHubKm();
        this.active = serviceArea.getActive();
        this.createdAt = serviceArea.getCreatedAt();
        this.updatedAt = serviceArea.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDistrict() {
        return district;
    }

    public BigDecimal getDistanceToHubKm() {
        return distanceToHubKm;
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
}
