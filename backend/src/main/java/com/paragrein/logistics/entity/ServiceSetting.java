package com.paragrein.logistics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "service_settings")
@Data
@EqualsAndHashCode(callSuper = true)
public class ServiceSetting extends AuditableEntity {

    @Column(name = "base_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseRate;

    @Column(name = "per_km_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal perKmRate;

    @Column(name = "advance_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal advancePercentage;

//  @Column(name = "per_kg_rate", nullable = false, precision = 10, scale = 2)
//  private BigDecimal perKgRate;

    @Column(nullable = false)
    private Boolean active;
}

//Precision = 10 → Total number of digits allowed (before + after the decimal point).
//Scale = 2 → Number of digits allowed after the decimal point.
