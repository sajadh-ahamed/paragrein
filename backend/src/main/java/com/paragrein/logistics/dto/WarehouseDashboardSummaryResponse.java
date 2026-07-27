package com.paragrein.logistics.dto;

import com.paragrein.logistics.enums.AvailabilityStatus;

public class WarehouseDashboardSummaryResponse {

    private long arrivalQueueCount;
    private long processingCount;
    private long readyForDispatchCount;
    private long completedWarehouseRecordsCount;
    private AvailabilityStatus currentStaffStatus;

    public WarehouseDashboardSummaryResponse(
            long arrivalQueueCount,
            long processingCount,
            long readyForDispatchCount,
            long completedWarehouseRecordsCount,
            AvailabilityStatus currentStaffStatus
    ) {
        this.arrivalQueueCount = arrivalQueueCount;
        this.processingCount = processingCount;
        this.readyForDispatchCount = readyForDispatchCount;
        this.completedWarehouseRecordsCount = completedWarehouseRecordsCount;
        this.currentStaffStatus = currentStaffStatus;
    }

    public long getArrivalQueueCount() {
        return arrivalQueueCount;
    }

    public long getProcessingCount() {
        return processingCount;
    }

    public long getReadyForDispatchCount() {
        return readyForDispatchCount;
    }

    public long getCompletedWarehouseRecordsCount() {
        return completedWarehouseRecordsCount;
    }

    public AvailabilityStatus getCurrentStaffStatus() {
        return currentStaffStatus;
    }
}
