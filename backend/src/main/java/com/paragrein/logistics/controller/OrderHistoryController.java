package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.OrderTimelineResponse;
import com.paragrein.logistics.service.OrderHistoryService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderHistoryController {

    private final OrderHistoryService orderHistoryService;

    public OrderHistoryController(OrderHistoryService orderHistoryService) {
        this.orderHistoryService = orderHistoryService;
    }

    @GetMapping("/{orderId}/status-history")
    public List<OrderTimelineResponse> getStatusHistory(@PathVariable Long orderId, Authentication authentication) {
        return orderHistoryService.getStatusHistory(orderId, authentication);
    }
}
