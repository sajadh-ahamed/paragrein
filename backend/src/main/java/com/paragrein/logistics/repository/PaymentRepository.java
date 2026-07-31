package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.Payment;
import com.paragrein.logistics.enums.PaymentStatus;
import com.paragrein.logistics.enums.PaymentType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Override
    @EntityGraph(attributePaths = { "order", "order.customer", "verifiedByUser" })
    List<Payment> findAll();

    List<Payment> findByOrderIdOrderByCreatedAtDesc(Long orderId);

    Optional<Payment> findFirstByOrderIdAndPaymentTypeOrderByCreatedAtDesc(Long orderId, PaymentType paymentType);

    @EntityGraph(attributePaths = { "order", "order.customer", "verifiedByUser" })
    List<Payment> findByPaymentTypeAndPaymentStatusOrderByCreatedAtDesc(PaymentType paymentType,
            PaymentStatus paymentStatus);

    @Override
    @EntityGraph(attributePaths = { "order", "order.customer", "verifiedByUser" })
    Optional<Payment> findById(Long id);

    @Query("SELECT p FROM Payment p WHERE p.paymentStatus = com.paragrein.logistics.enums.PaymentStatus.VERIFIED " +
            "AND ( (p.verifiedAt IS NOT NULL AND CAST(p.verifiedAt AS date) >= :dateFrom AND CAST(p.verifiedAt AS date) <= :dateTo) OR "
            +
            "(p.verifiedAt IS NULL AND CAST(p.createdAt AS date) >= :dateFrom AND CAST(p.createdAt AS date) <= :dateTo) )")
    List<Payment> findVerifiedPaymentsInDateRange(@Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = com.paragrein.logistics.enums.PaymentStatus.VERIFIED "
            +
            "AND ( (p.verifiedAt IS NOT NULL AND CAST(p.verifiedAt AS date) >= :dateFrom AND CAST(p.verifiedAt AS date) <= :dateTo) OR "
            +
            "(p.verifiedAt IS NULL AND CAST(p.createdAt AS date) >= :dateFrom AND CAST(p.createdAt AS date) <= :dateTo) )")
    BigDecimal sumVerifiedPaymentsInDateRange(@Param("dateFrom") LocalDate dateFrom, @Param("dateTo") LocalDate dateTo);

    @EntityGraph(attributePaths = { "order", "order.customer", "verifiedByUser" })
    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = :status")
    BigDecimal sumTotalByPaymentStatus(@Param("status") PaymentStatus status);
}
