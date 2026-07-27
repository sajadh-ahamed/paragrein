package com.paragrein.logistics.dto;

import java.math.BigDecimal;
import java.time.YearMonth;

public class MonthlyReportResponse {

    private String reportMonth;
    private ReportSummaryResponse summary;
    private long ordersCreated;
    private long ordersDelivered;
    private BigDecimal revenueCollected;

    public MonthlyReportResponse(YearMonth reportMonth, ReportSummaryResponse summary, long ordersCreated, long ordersDelivered, BigDecimal revenueCollected) {
        this.reportMonth = reportMonth.toString();
        this.summary = summary;
        this.ordersCreated = ordersCreated;
        this.ordersDelivered = ordersDelivered;
        this.revenueCollected = revenueCollected;
    }

    public String getReportMonth() {
        return reportMonth;
    }

    public ReportSummaryResponse getSummary() {
        return summary;
    }

    public long getOrdersCreated() {
        return ordersCreated;
    }

    public long getOrdersDelivered() {
        return ordersDelivered;
    }

    public BigDecimal getRevenueCollected() {
        return revenueCollected;
    }
}
