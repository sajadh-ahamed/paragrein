package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.DeliveryConfirmation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryConfirmationRepository extends JpaRepository<DeliveryConfirmation, Long> {

    @Override
    @EntityGraph(attributePaths = {
            "order",
            "order.customer",
            "driverUser"
    })
    List<DeliveryConfirmation> findAll();

    @Override
    @EntityGraph(attributePaths = {
            "order",
            "order.customer",
            "driverUser"
    })
    Optional<DeliveryConfirmation> findById(Long id);

    @EntityGraph(attributePaths = {
            "order",
            "order.customer",
            "driverUser"
    })
    Optional<DeliveryConfirmation> findByOrderId(Long orderId);
}