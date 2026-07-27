package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.PublicTrackingResponse;
import com.paragrein.logistics.service.CustomerOrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicTrackingController {

    private final CustomerOrderService customerOrderService;

    public PublicTrackingController(CustomerOrderService customerOrderService) {
        this.customerOrderService = customerOrderService;
    }

    @GetMapping("/track/{trackingNumber}")
    public PublicTrackingResponse trackOrder(@PathVariable String trackingNumber) {
        return customerOrderService.trackOrderPublic(trackingNumber);
    }
}
