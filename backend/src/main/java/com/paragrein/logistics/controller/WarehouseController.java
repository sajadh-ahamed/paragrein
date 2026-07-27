package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.ConfirmWarehouseArrivalRequest;
import com.paragrein.logistics.dto.MarkReadyForDispatchRequest;
import com.paragrein.logistics.dto.MarkWarehouseProcessingRequest;
import com.paragrein.logistics.dto.WarehouseDashboardSummaryResponse;
import com.paragrein.logistics.dto.WarehouseOrderDetailResponse;
import com.paragrein.logistics.dto.WarehouseOrderSummaryResponse;
import com.paragrein.logistics.service.WarehouseService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/warehouse")
public class WarehouseController {

    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @GetMapping("/dashboard-summary")
    public WarehouseDashboardSummaryResponse getDashboardSummary(Authentication authentication) {
        return warehouseService.getWarehouseDashboardSummary(authentication);
    }

    @GetMapping("/arrival-queue")
    public List<WarehouseOrderSummaryResponse> getArrivalQueue() {
        return warehouseService.getArrivalQueue();
    }

    @GetMapping("/processing")
    public List<WarehouseOrderSummaryResponse> getProcessingOrders() {
        return warehouseService.getProcessingOrders();
    }

    @GetMapping("/ready-for-dispatch")
    public List<WarehouseOrderSummaryResponse> getReadyForDispatchOrders() {
        return warehouseService.getReadyForDispatchOrders();
    }

    @GetMapping("/history")
    public List<WarehouseOrderSummaryResponse> getWarehouseHistory() {
        return warehouseService.getWarehouseHistory();
    }

    @GetMapping("/orders/{orderId}")
    public WarehouseOrderDetailResponse getOrderDetail(@PathVariable Long orderId) {
        return warehouseService.getWarehouseOrderDetail(orderId);
    }

    @PatchMapping("/orders/{orderId}/confirm-arrival")
    public WarehouseOrderDetailResponse confirmArrival(
            @PathVariable Long orderId,
            @RequestBody ConfirmWarehouseArrivalRequest request,
            Authentication authentication
    ) {
        return warehouseService.confirmArrival(orderId, request, authentication);
    }

    @PatchMapping("/orders/{orderId}/mark-processing")
    public WarehouseOrderDetailResponse markProcessing(
            @PathVariable Long orderId,
            @RequestBody(required = false) MarkWarehouseProcessingRequest request,
            Authentication authentication
    ) {
        return warehouseService.markProcessing(orderId, request, authentication);
    }

    @PatchMapping("/orders/{orderId}/ready-for-dispatch")
    public WarehouseOrderDetailResponse markReadyForDispatch(
            @PathVariable Long orderId,
            @RequestBody(required = false) MarkReadyForDispatchRequest request,
            Authentication authentication
    ) {
        return warehouseService.markReadyForDispatch(orderId, request, authentication);
    }
}
