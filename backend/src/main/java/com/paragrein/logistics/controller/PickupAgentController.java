package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.PickupActionRequest;
import com.paragrein.logistics.dto.PickupDashboardSummaryResponse;
import com.paragrein.logistics.dto.PickupTaskDetailResponse;
import com.paragrein.logistics.dto.PickupTaskSummaryResponse;
import com.paragrein.logistics.service.PickupAgentService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pickup")
public class PickupAgentController {

    private final PickupAgentService pickupAgentService;

    public PickupAgentController(PickupAgentService pickupAgentService) {
        this.pickupAgentService = pickupAgentService;
    }

    @GetMapping("/dashboard-summary")
    public PickupDashboardSummaryResponse getDashboardSummary(Authentication authentication) {
        return pickupAgentService.getPickupDashboardSummary(authentication);
    }

    @GetMapping("/tasks")
    public List<PickupTaskSummaryResponse> getAssignedPickupTasks(Authentication authentication) {
        return pickupAgentService.getAssignedPickupTasks(authentication);
    }

    @GetMapping("/tasks/history")
    public List<PickupTaskSummaryResponse> getPickupHistory(Authentication authentication) {
        return pickupAgentService.getPickupHistory(authentication);
    }

    @GetMapping("/tasks/{assignmentId}")
    public PickupTaskDetailResponse getPickupTaskDetail(@PathVariable Long assignmentId, Authentication authentication) {
        return pickupAgentService.getPickupTaskDetail(assignmentId, authentication);
    }

    @PatchMapping("/tasks/{assignmentId}/accept")
    public PickupTaskDetailResponse acceptPickupTask(
            @PathVariable Long assignmentId,
            @RequestBody(required = false) PickupActionRequest request,
            Authentication authentication
    ) {
        return pickupAgentService.acceptPickupTask(assignmentId, request, authentication);
    }

    @PatchMapping("/tasks/{assignmentId}/mark-picked-up")
    public PickupTaskDetailResponse markParcelPickedUp(
            @PathVariable Long assignmentId,
            @RequestBody(required = false) PickupActionRequest request,
            Authentication authentication
    ) {
        return pickupAgentService.markParcelPickedUp(assignmentId, request, authentication);
    }

    @PatchMapping("/tasks/{assignmentId}/reach-warehouse")
    public PickupTaskDetailResponse markReachedWarehouse(
            @PathVariable Long assignmentId,
            @RequestBody(required = false) PickupActionRequest request,
            Authentication authentication
    ) {
        return pickupAgentService.markReachedWarehouse(assignmentId, request, authentication);
    }
}
