package com.paragrein.logistics.dto;

public class ReportSummaryResponse {

    private long totalOrders;
    private long pendingOrders;
    private long activePickupOrders;
    private long warehouseOrders;
    private long readyForDispatchOrders;
    private long activeDeliveryOrders;
    private long deliveredOrders;
    private long rejectedOrders;

    public ReportSummaryResponse(
            long totalOrders,
            long pendingOrders,
            long activePickupOrders,
            long warehouseOrders,
            long readyForDispatchOrders,
            long activeDeliveryOrders,
            long deliveredOrders,
            long rejectedOrders
    ) {
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.activePickupOrders = activePickupOrders;
        this.warehouseOrders = warehouseOrders;
        this.readyForDispatchOrders = readyForDispatchOrders;
        this.activeDeliveryOrders = activeDeliveryOrders;
        this.deliveredOrders = deliveredOrders;
        this.rejectedOrders = rejectedOrders;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public long getActivePickupOrders() {
        return activePickupOrders;
    }

    public long getWarehouseOrders() {
        return warehouseOrders;
    }

    public long getReadyForDispatchOrders() {
        return readyForDispatchOrders;
    }

    public long getActiveDeliveryOrders() {
        return activeDeliveryOrders;
    }

    public long getDeliveredOrders() {
        return deliveredOrders;
    }

    public long getRejectedOrders() {
        return rejectedOrders;
    }
}
