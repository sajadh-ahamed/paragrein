package com.paragrein.logistics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "warehouse_records")
@Data
@EqualsAndHashCode(callSuper = true)
public class WarehouseRecord extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "received_by_user_id")
    private User receivedByUser;

    @Column(name = "parcel_condition", nullable = false, length = 120)
    private String parcelCondition;

    @Column(name = "storage_zone", length = 60)
    private String storageZone;

    @Column(name = "storage_rack", length = 60)
    private String storageRack;

    @Column(length = 500)
    private String notes;

    @Column(name = "received_at", nullable = false)
    private LocalDateTime receivedAt;

    @Column(name = "ready_for_dispatch_at")
    private LocalDateTime readyForDispatchAt;
}
