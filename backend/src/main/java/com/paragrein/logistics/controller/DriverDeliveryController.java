package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.CompleteDeliveryRequest;
import com.paragrein.logistics.dto.DriverActionRequest;
import com.paragrein.logistics.dto.DriverDashboardSummaryResponse;
import com.paragrein.logistics.dto.DriverDeliveryHistoryResponse;
import com.paragrein.logistics.dto.DriverDeliveryTaskDetailResponse;
import com.paragrein.logistics.dto.DriverDeliveryTaskSummaryResponse;
import com.paragrein.logistics.service.DriverDeliveryService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/driver")
public class DriverDeliveryController {

    private final DriverDeliveryService driverDeliveryService;

    public DriverDeliveryController(DriverDeliveryService driverDeliveryService) {
        this.driverDeliveryService = driverDeliveryService;
    }

    @GetMapping("/dashboard-summary")
    public DriverDashboardSummaryResponse getDashboardSummary(Authentication authentication) {
        return driverDeliveryService.getDriverDashboardSummary(authentication);
    }

    @GetMapping("/deliveries")
    public List<DriverDeliveryTaskSummaryResponse> getAssignedDeliveries(Authentication authentication) {
        return driverDeliveryService.getAssignedDeliveries(authentication);
    }

    @GetMapping("/deliveries/history")
    public List<DriverDeliveryHistoryResponse> getDeliveryHistory(Authentication authentication) {
        return driverDeliveryService.getDeliveryHistory(authentication);
    }

    @GetMapping("/deliveries/{assignmentId}")
    public DriverDeliveryTaskDetailResponse getDeliveryTaskDetail(@PathVariable Long assignmentId, Authentication authentication) {
        return driverDeliveryService.getDeliveryTaskDetail(assignmentId, authentication);
    }

    @PatchMapping("/deliveries/{assignmentId}/accept")
    public DriverDeliveryTaskDetailResponse acceptDelivery(
            @PathVariable Long assignmentId,
            @RequestBody(required = false) DriverActionRequest request,
            Authentication authentication
    ) {
        return driverDeliveryService.acceptDelivery(assignmentId, request, authentication);
    }

    @PatchMapping("/deliveries/{assignmentId}/reach-destination")
    public DriverDeliveryTaskDetailResponse markReachedDestination(
            @PathVariable Long assignmentId,
            @RequestBody(required = false) DriverActionRequest request,
            Authentication authentication
    ) {
        return driverDeliveryService.markReachedDestination(assignmentId, request, authentication);
    }

    @PatchMapping("/deliveries/{assignmentId}/complete")
    public DriverDeliveryTaskDetailResponse completeDelivery(
            @PathVariable Long assignmentId,
            @RequestBody CompleteDeliveryRequest request,
            Authentication authentication
    ) {
        return driverDeliveryService.completeDelivery(assignmentId, request, authentication);
    }
}
