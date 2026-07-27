package com.paragrein.logistics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "service_areas")
@Data
@EqualsAndHashCode(callSuper = true)
public class ServiceArea extends AuditableEntity {

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 120)
    private String district;

    @Column(name = "distance_to_hub_km", nullable = false, precision = 10, scale = 2)
    private BigDecimal distanceToHubKm;

    @Column(nullable = false)
    private Boolean active;
}
