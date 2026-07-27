package com.paragrein.logistics.dto;

import com.paragrein.logistics.enums.AvailabilityStatus;

public class PickupDashboardSummaryResponse {

    private long assignedPickupsCount;
    private long acceptedPickupsCount;
    private long inTransitToWarehouseCount;
    private long completedPickupsCount;
    private AvailabilityStatus currentAvailabilityStatus;

    public PickupDashboardSummaryResponse(
            long assignedPickupsCount,
            long acceptedPickupsCount,
            long inTransitToWarehouseCount,
            long completedPickupsCount,
            AvailabilityStatus currentAvailabilityStatus
    ) {
        this.assignedPickupsCount = assignedPickupsCount;
        this.acceptedPickupsCount = acceptedPickupsCount;
        this.inTransitToWarehouseCount = inTransitToWarehouseCount;
        this.completedPickupsCount = completedPickupsCount;
        this.currentAvailabilityStatus = currentAvailabilityStatus;
    }

    public long getAssignedPickupsCount() {
        return assignedPickupsCount;
    }

    public long getAcceptedPickupsCount() {
        return acceptedPickupsCount;
    }

    public long getInTransitToWarehouseCount() {
        return inTransitToWarehouseCount;
    }

    public long getCompletedPickupsCount() {
        return completedPickupsCount;
    }

    public AvailabilityStatus getCurrentAvailabilityStatus() {
        return currentAvailabilityStatus;
    }
}
