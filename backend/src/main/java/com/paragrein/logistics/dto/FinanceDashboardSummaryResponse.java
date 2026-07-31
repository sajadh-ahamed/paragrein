package com.paragrein.logistics.dto;

import java.math.BigDecimal;

public class FinanceDashboardSummaryResponse {

    private long pendingAdvanceCount;
    private long verifiedAdvanceCount;
    private long rejectedAdvanceCount;
    private BigDecimal totalVerifiedAdvanceAmount;
    private BigDecimal totalOutstandingBalanceAmount;
    private long totalOrdersAwaitingFinance;
    private long totalOrdersReadyForAdminAssignment;
    private BigDecimal totalRevenue;

    public FinanceDashboardSummaryResponse(
            long pendingAdvanceCount,
            long verifiedAdvanceCount,
            long rejectedAdvanceCount,
            BigDecimal totalVerifiedAdvanceAmount,
            BigDecimal totalOutstandingBalanceAmount,
            long totalOrdersAwaitingFinance,
            long totalOrdersReadyForAdminAssignment,
            BigDecimal totalRevenue
    ) {
        this.pendingAdvanceCount = pendingAdvanceCount;
        this.verifiedAdvanceCount = verifiedAdvanceCount;
        this.rejectedAdvanceCount = rejectedAdvanceCount;
        this.totalVerifiedAdvanceAmount = totalVerifiedAdvanceAmount;
        this.totalOutstandingBalanceAmount = totalOutstandingBalanceAmount;
        this.totalOrdersAwaitingFinance = totalOrdersAwaitingFinance;
        this.totalOrdersReadyForAdminAssignment = totalOrdersReadyForAdminAssignment;
        this.totalRevenue = totalRevenue;
    }

    public long getPendingAdvanceCount() {
        return pendingAdvanceCount;
    }

    public long getVerifiedAdvanceCount() {
        return verifiedAdvanceCount;
    }

    public long getRejectedAdvanceCount() {
        return rejectedAdvanceCount;
    }

    public BigDecimal getTotalVerifiedAdvanceAmount() {
        return totalVerifiedAdvanceAmount;
    }

    public BigDecimal getTotalOutstandingBalanceAmount() {
        return totalOutstandingBalanceAmount;
    }

    public long getTotalOrdersAwaitingFinance() {
        return totalOrdersAwaitingFinance;
    }

    public long getTotalOrdersReadyForAdminAssignment() {
        return totalOrdersReadyForAdminAssignment;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
}
