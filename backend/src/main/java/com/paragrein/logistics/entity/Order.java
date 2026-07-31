package com.paragrein.logistics.entity;

import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "orders")
@Data
@EqualsAndHashCode(callSuper = true)
public class Order extends AuditableEntity {

    @Column(name = "tracking_number", nullable = false, unique = true, length = 40)
    private String trackingNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(name = "sender_name", nullable = false, length = 150)
    private String senderName;

    @Column(name = "sender_phone", nullable = false, length = 30)
    private String senderPhone;

    @Column(name = "sender_address", nullable = false, length = 500)
    private String senderAddress;

    @Column(name = "receiver_name", nullable = false, length = 150)
    private String receiverName;

    @Column(name = "receiver_phone", nullable = false, length = 30)
    private String receiverPhone;

    @Column(name = "receiver_address", nullable = false, length = 500)
    private String receiverAddress;

    @Column(name = "pickup_address", length = 500)
    private String pickupAddress;

    @Column(name = "dropoff_address", length = 500)
    private String dropoffAddress;

    @Column(name = "parcel_description", nullable = false, length = 500)
    private String parcelDescription;

    @Column(name = "parcel_weight_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal parcelWeightKg;

    @Column(name = "route_distance_km", nullable = false, precision = 10, scale = 2)
    private BigDecimal routeDistanceKm;

    @Column(name = "base_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseRate;

    @Column(name = "per_km_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal perKmRate;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "advance_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal advanceAmount;

    @Column(name = "balance_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal balanceAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false, length = 60)
    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "financial_status", nullable = false, length = 60)
    private FinancialStatus financialStatus;
}

//for seperate textfields for inputs

// Sender
/*private String senderDistrict;
private String senderTown;
private String senderAddress;

// Receiver
private String receiverDistrict;
private String receiverTown;
private String receiverAddress;

// Pickup
private String pickupDistrict;
private String pickupTown;
private String pickupAddress;

// Drop-off
private String dropoffDistrict;
private String dropoffTown;
private String dropoffAddress; */