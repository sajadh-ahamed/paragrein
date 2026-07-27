package com.paragrein.logistics.dto;

import java.math.BigDecimal;
import java.util.List;

public class RevenueReportResponse {

    private BigDecimal totalAdvanceReceived;
    private BigDecimal totalBalanceCollected;
    private BigDecimal totalRevenue;
    private BigDecimal outstandingBalanceTotal;
    private long verifiedAdvanceCount;
    private long fullySettledCount;
    private List<ReportRowResponse> rows;

    public RevenueReportResponse(
            BigDecimal totalAdvanceReceived,
            BigDecimal totalBalanceCollected,
            BigDecimal totalRevenue,
            BigDecimal outstandingBalanceTotal,
            long verifiedAdvanceCount,
            long fullySettledCount,
            List<ReportRowResponse> rows
    ) {
        this.totalAdvanceReceived = totalAdvanceReceived;
        this.totalBalanceCollected = totalBalanceCollected;
        this.totalRevenue = totalRevenue;
        this.outstandingBalanceTotal = outstandingBalanceTotal;
        this.verifiedAdvanceCount = verifiedAdvanceCount;
        this.fullySettledCount = fullySettledCount;
        this.rows = rows;
    }

    public BigDecimal getTotalAdvanceReceived() {
        return totalAdvanceReceived;
    }

    public BigDecimal getTotalBalanceCollected() {
        return totalBalanceCollected;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public BigDecimal getOutstandingBalanceTotal() {
        return outstandingBalanceTotal;
    }

    public long getVerifiedAdvanceCount() {
        return verifiedAdvanceCount;
    }

    public long getFullySettledCount() {
        return fullySettledCount;
    }

    public List<ReportRowResponse> getRows() {
        return rows;
    }
}
