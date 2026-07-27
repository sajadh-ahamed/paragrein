package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.OrderStatusHistory;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long> {

    @EntityGraph(attributePaths = {"order", "order.customer", "changedByUser", "changedByUser.role"})
    List<OrderStatusHistory> findByOrderIdOrderByCreatedAtAsc(Long orderId);
}
