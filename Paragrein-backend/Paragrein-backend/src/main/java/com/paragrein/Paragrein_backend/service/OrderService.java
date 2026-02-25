package com.paragrein.Paragrein_backend.service;

import com.paragrein.Paragrein_backend.entity.*;
import com.paragrein.Paragrein_backend.repository.OrderRepository;
import com.paragrein.Paragrein_backend.repository.ProductRepository;
import com.paragrein.Paragrein_backend.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    // Create new order
    public Order createOrder(Order order) {
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    // Get order by ID
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get orders by customer ID
    public List<Order> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    // Get orders by status
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    // Update order
    public Order updateOrder(Long id, Order orderDetails) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent()) {
            Order existingOrder = order.get();
            existingOrder.setStatus(orderDetails.getStatus());
            existingOrder.setDeliveryAddress(orderDetails.getDeliveryAddress());
            existingOrder.setDeliveryCity(orderDetails.getDeliveryCity());
            existingOrder.setPostalCode(orderDetails.getPostalCode());
            existingOrder.setEstimatedDeliveryDate(orderDetails.getEstimatedDeliveryDate());
            existingOrder.setSpecialInstructions(orderDetails.getSpecialInstructions());
            existingOrder.setUpdatedAt(LocalDateTime.now());
            return orderRepository.save(existingOrder);
        }
        return null;
    }

    // Cancel order
    public Order cancelOrder(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent()) {
            Order existingOrder = order.get();
            existingOrder.setStatus("CANCELLED");
            existingOrder.setUpdatedAt(LocalDateTime.now());
            return orderRepository.save(existingOrder);
        }
        return null;
    }

    // Delete order
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // Get product by ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Create product
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Get warehouse by ID
    public Optional<Warehouse> getWarehouseById(Long id) {
        return warehouseRepository.findById(id);
    }

    // Get all warehouses
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    // Create warehouse
    public Warehouse createWarehouse(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }
}
