package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.Payment;
import com.paragrein.logistics.enums.PaymentStatus;
import com.paragrein.logistics.enums.PaymentType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Override
    @EntityGraph(attributePaths = {"order", "order.customer", "verifiedByUser"})
    List<Payment> findAll();

    List<Payment> findByOrderIdOrderByCreatedAtDesc(Long orderId);

    Optional<Payment> findFirstByOrderIdAndPaymentTypeOrderByCreatedAtDesc(Long orderId, PaymentType paymentType);

    @EntityGraph(attributePaths = {"order", "order.customer", "verifiedByUser"})
    List<Payment> findByPaymentTypeAndPaymentStatusOrderByCreatedAtDesc(PaymentType paymentType, PaymentStatus paymentStatus);

    @Override
    @EntityGraph(attributePaths = {"order", "order.customer", "verifiedByUser"})
    Optional<Payment> findById(Long id);
}
