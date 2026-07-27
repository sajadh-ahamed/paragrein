package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.Order;
import com.paragrein.logistics.enums.FinancialStatus;
import com.paragrein.logistics.enums.OrderStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Override
    @EntityGraph(attributePaths = {"pickupArea", "dropoffArea", "customer"})
    List<Order> findAll();

    @EntityGraph(attributePaths = {"pickupArea", "dropoffArea", "customer"})
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    @EntityGraph(attributePaths = {"pickupArea", "dropoffArea", "customer"})
    Optional<Order> findByIdAndCustomerId(Long id, Long customerId);

    @EntityGraph(attributePaths = {"pickupArea", "dropoffArea", "customer"})
    Optional<Order> findByTrackingNumberIgnoreCase(String trackingNumber);

    boolean existsByTrackingNumber(String trackingNumber);

    long countByFinancialStatus(FinancialStatus financialStatus);

    long countByFinancialStatusAndOrderStatus(FinancialStatus financialStatus, OrderStatus orderStatus);

    @EntityGraph(attributePaths = {"pickupArea", "dropoffArea", "customer"})
    List<Order> findByFinancialStatusInOrderByUpdatedAtDesc(List<FinancialStatus> financialStatuses);

    @EntityGraph(attributePaths = {"pickupArea", "dropoffArea", "customer"})
    List<Order> findTop10ByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"pickupArea", "dropoffArea", "customer"})
    List<Order> findByFinancialStatusAndOrderStatusOrderByUpdatedAtDesc(FinancialStatus financialStatus, OrderStatus orderStatus);

    @EntityGraph(attributePaths = {"pickupArea", "dropoffArea", "customer"})
    List<Order> findByOrderStatusOrderByUpdatedAtDesc(OrderStatus orderStatus);

    long countByOrderStatus(OrderStatus orderStatus);

    long countByOrderStatusAndFinancialStatus(OrderStatus orderStatus, FinancialStatus financialStatus);

    @Query("select count(o) from Order o where o.orderStatus = :orderStatus and o.updatedAt >= :startOfDay")
    long countByOrderStatusUpdatedToday(OrderStatus orderStatus, java.time.LocalDateTime startOfDay);

    @Query("select count(o) from Order o where o.financialStatus = :financialStatus and o.updatedAt >= :startOfDay")
    long countByFinancialStatusUpdatedToday(FinancialStatus financialStatus, java.time.LocalDateTime startOfDay);
}
