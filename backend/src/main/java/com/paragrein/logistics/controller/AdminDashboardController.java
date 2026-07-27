package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.AdminDashboardSummaryResponse;
import com.paragrein.logistics.dto.AdminOrderDetailResponse;
import com.paragrein.logistics.dto.AdminOrderSummaryResponse;
import com.paragrein.logistics.dto.AssignDriverRequest;
import com.paragrein.logistics.dto.AssignPickupAgentRequest;
import com.paragrein.logistics.dto.AssignmentResponse;
import com.paragrein.logistics.dto.DeliveryAssignmentResponse;
import com.paragrein.logistics.dto.ReadyForDispatchOrderResponse;
import com.paragrein.logistics.service.AdminAssignmentService;
import com.paragrein.logistics.service.AdminDashboardService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;
    private final AdminAssignmentService adminAssignmentService;

    public AdminDashboardController(AdminDashboardService adminDashboardService, AdminAssignmentService adminAssignmentService) {
        this.adminDashboardService = adminDashboardService;
        this.adminAssignmentService = adminAssignmentService;
    }

    @GetMapping("/dashboard-summary")
    public AdminDashboardSummaryResponse getDashboardSummary() {
        return adminDashboardService.getAdminDashboardSummary();
    }

    @GetMapping("/orders/latest")
    public List<AdminOrderSummaryResponse> getLatestOrders() {
        return adminDashboardService.getLatestOrders();
    }

    @GetMapping("/orders/ready-for-pickup")
    public List<AdminOrderSummaryResponse> getOrdersReadyForPickupAssignment() {
        return adminDashboardService.getOrdersReadyForPickupAssignment();
    }

    @GetMapping("/orders/ready-for-driver")
    public List<ReadyForDispatchOrderResponse> getOrdersReadyForDriverAssignment() {
        return adminDashboardService.getOrdersReadyForDriverAssignment();
    }

    @GetMapping("/orders/{orderId}")
    public AdminOrderDetailResponse getOrderDetail(@PathVariable Long orderId) {
        return adminDashboardService.getAdminOrderDetail(orderId);
    }

    @PatchMapping("/orders/{orderId}/assign-pickup")
    public AssignmentResponse assignPickupAgent(
            @PathVariable Long orderId,
            @RequestBody AssignPickupAgentRequest request,
            Authentication authentication
    ) {
        return adminAssignmentService.assignPickupAgentToOrder(orderId, request, authentication);
    }

    @PatchMapping("/orders/{orderId}/assign-driver")
    public DeliveryAssignmentResponse assignDriver(
            @PathVariable Long orderId,
            @RequestBody AssignDriverRequest request,
            Authentication authentication
    ) {
        return adminAssignmentService.assignDriverToOrder(orderId, request, authentication);
    }
}
