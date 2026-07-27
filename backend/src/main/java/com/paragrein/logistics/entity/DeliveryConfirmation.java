package com.paragrein.logistics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "delivery_confirmations")
public class DeliveryConfirmation extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "driver_user_id", nullable = false)
    private User driverUser;

    @Column(name = "recipient_name", length = 150)
    private String recipientName;

    @Column(name = "balance_collected_amount", precision = 10, scale = 2)
    private BigDecimal balanceCollectedAmount;

    @Column(name = "proof_image_path")
    private String proofImagePath;

    @Column(name = "delivery_notes", length = 500)
    private String deliveryNotes;

    @Column(name = "reached_destination_at")
    private LocalDateTime reachedDestinationAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;
}
