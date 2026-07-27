package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.AssignmentResponse;
import com.paragrein.logistics.dto.AdminDeliveryAssignmentSummaryResponse;
import com.paragrein.logistics.dto.DeliveryAssignmentResponse;
import com.paragrein.logistics.dto.DriverAvailabilityResponse;
import com.paragrein.logistics.dto.EmployeeAvailabilityResponse;
import com.paragrein.logistics.service.AdminAssignmentService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/assignments")
public class AdminAssignmentController {

    private final AdminAssignmentService adminAssignmentService;

    public AdminAssignmentController(AdminAssignmentService adminAssignmentService) {
        this.adminAssignmentService = adminAssignmentService;
    }

    @GetMapping("/available-pickup-agents")
    public List<EmployeeAvailabilityResponse> getAvailablePickupAgents() {
        return adminAssignmentService.getAvailablePickupAgents();
    }

    @GetMapping("/available-drivers")
    public List<DriverAvailabilityResponse> getAvailableDrivers() {
        return adminAssignmentService.getAvailableDrivers();
    }

    @GetMapping("/active-pickups")
    public List<AssignmentResponse> getActivePickupAssignments() {
        return adminAssignmentService.getActivePickupAssignments();
    }

    @GetMapping("/active-deliveries")
    public List<AdminDeliveryAssignmentSummaryResponse> getActiveDeliveryAssignments() {
        return adminAssignmentService.getActiveDeliveryAssignments();
    }

    @GetMapping
    public List<AssignmentResponse> getAssignmentHistory() {
        return adminAssignmentService.getAssignmentHistory();
    }

    @GetMapping("/order/{orderId}")
    public List<AssignmentResponse> getAssignmentHistoryForOrder(@PathVariable Long orderId) {
        return adminAssignmentService.getAssignmentHistoryForOrder(orderId);
    }

    @GetMapping("/deliveries/{assignmentId}")
    public DeliveryAssignmentResponse getDeliveryAssignmentDetail(@PathVariable Long assignmentId) {
        return adminAssignmentService.getDeliveryAssignmentDetail(assignmentId);
    }

    @GetMapping("/{assignmentId}")
    public AssignmentResponse getAssignmentDetail(@PathVariable Long assignmentId) {
        return adminAssignmentService.getAssignmentDetail(assignmentId);
    }
}
