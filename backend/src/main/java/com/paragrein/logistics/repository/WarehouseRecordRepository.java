package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.WarehouseRecord;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRecordRepository extends JpaRepository<WarehouseRecord, Long> {

    @Override
    @EntityGraph(attributePaths = {"order", "order.customer", "receivedByUser"})
    List<WarehouseRecord> findAll();

    boolean existsByOrderId(Long orderId);

    @EntityGraph(attributePaths = {"order", "order.customer", "receivedByUser"})
    Optional<WarehouseRecord> findByOrderId(Long orderId);

    @EntityGraph(attributePaths = {"order", "order.customer", "receivedByUser"})
    List<WarehouseRecord> findByOrder_OrderStatusOrderByReceivedAtDesc(com.paragrein.logistics.enums.OrderStatus orderStatus);

    @EntityGraph(attributePaths = {"order", "order.customer", "receivedByUser"})
    List<WarehouseRecord> findByReadyForDispatchAtIsNotNullOrderByReadyForDispatchAtDesc();

    long countByReadyForDispatchAtIsNotNull();
}
