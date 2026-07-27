package com.paragrein.logistics.dto;

import com.paragrein.logistics.enums.AvailabilityStatus;
import java.math.BigDecimal;

public class DriverDashboardSummaryResponse {

    private long assignedDeliveriesCount;
    private long acceptedDeliveriesCount;
    private long reachedDestinationCount;
    private long completedDeliveriesCount;
    private BigDecimal totalBalanceToCollect;
    private AvailabilityStatus currentAvailabilityStatus;

    public DriverDashboardSummaryResponse(
            long assignedDeliveriesCount,
            long acceptedDeliveriesCount,
            long reachedDestinationCount,
            long completedDeliveriesCount,
            BigDecimal totalBalanceToCollect,
            AvailabilityStatus currentAvailabilityStatus
    ) {
        this.assignedDeliveriesCount = assignedDeliveriesCount;
        this.acceptedDeliveriesCount = acceptedDeliveriesCount;
        this.reachedDestinationCount = reachedDestinationCount;
        this.completedDeliveriesCount = completedDeliveriesCount;
        this.totalBalanceToCollect = totalBalanceToCollect;
        this.currentAvailabilityStatus = currentAvailabilityStatus;
    }

    public long getAssignedDeliveriesCount() {
        return assignedDeliveriesCount;
    }

    public long getAcceptedDeliveriesCount() {
        return acceptedDeliveriesCount;
    }

    public long getReachedDestinationCount() {
        return reachedDestinationCount;
    }

    public long getCompletedDeliveriesCount() {
        return completedDeliveriesCount;
    }

    public BigDecimal getTotalBalanceToCollect() {
        return totalBalanceToCollect;
    }

    public AvailabilityStatus getCurrentAvailabilityStatus() {
        return currentAvailabilityStatus;
    }
}
