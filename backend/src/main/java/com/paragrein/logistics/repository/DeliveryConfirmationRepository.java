package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.DeliveryConfirmation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryConfirmationRepository extends JpaRepository<DeliveryConfirmation, Long> {

    @Override
    @EntityGraph(attributePaths = {"order", "order.customer", "order.pickupArea", "order.dropoffArea", "driverUser"})
    List<DeliveryConfirmation> findAll();

    @EntityGraph(attributePaths = {"order", "order.customer", "order.pickupArea", "order.dropoffArea", "driverUser"})
    Optional<DeliveryConfirmation> findByOrderId(Long orderId);
}
