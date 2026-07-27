package com.paragrein.logistics.dto;

public class AdminDashboardSummaryResponse {

    private long newOrderRequests;
    private long verifiedToday;
    private long pendingAdvance;
    private long activeEmployees;
    private long ordersReadyForPickup;
    private long activePickups;
    private long warehousePending;
    private long completedDeliveries;
    private long readyForDriverAssignmentCount;
    private long activeDeliveriesCount;
    private long availableDriversCount;

    public AdminDashboardSummaryResponse(
            long newOrderRequests,
            long verifiedToday,
            long pendingAdvance,
            long activeEmployees,
            long ordersReadyForPickup,
            long activePickups,
            long warehousePending,
            long completedDeliveries) {
        this.newOrderRequests = newOrderRequests;
        this.verifiedToday = verifiedToday;
        this.pendingAdvance = pendingAdvance;
        this.activeEmployees = activeEmployees;
        this.ordersReadyForPickup = ordersReadyForPickup;
        this.activePickups = activePickups;
        this.warehousePending = warehousePending;
        this.completedDeliveries = completedDeliveries;
    }

    public AdminDashboardSummaryResponse(
            long newOrderRequests,
            long verifiedToday,
            long pendingAdvance,
            long activeEmployees,
            long ordersReadyForPickup,
            long activePickups,
            long warehousePending,
            long completedDeliveries,
            long readyForDriverAssignmentCount,
            long activeDeliveriesCount,
            long availableDriversCount) {
        this(newOrderRequests, verifiedToday, pendingAdvance, activeEmployees, ordersReadyForPickup, activePickups,
                warehousePending, completedDeliveries);
        this.readyForDriverAssignmentCount = readyForDriverAssignmentCount;
        this.activeDeliveriesCount = activeDeliveriesCount;
        this.availableDriversCount = availableDriversCount;
    }

    public long getNewOrderRequests() {
        return newOrderRequests;
    }

    public long getVerifiedToday() {
        return verifiedToday;
    }

    public long getPendingAdvance() {
        return pendingAdvance;
    }

    public long getActiveEmployees() {
        return activeEmployees;
    }

    public long getOrdersReadyForPickup() {
        return ordersReadyForPickup;
    }

    public long getActivePickups() {
        return activePickups;
    }

    public long getWarehousePending() {
        return warehousePending;
    }

    public long getCompletedDeliveries() {
        return completedDeliveries;
    }

    public long getReadyForDriverAssignmentCount() {
        return readyForDriverAssignmentCount;
    }

    public long getActiveDeliveriesCount() {
        return activeDeliveriesCount;
    }

    public long getAvailableDriversCount() {
        return availableDriversCount;
    }
}
