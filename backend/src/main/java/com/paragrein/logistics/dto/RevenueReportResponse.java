package com.paragrein.logistics.dto;

import java.math.BigDecimal;
import java.util.List;

public class RevenueReportResponse {

    private final BigDecimal totalAdvance;
    private final BigDecimal totalBalance;
    private final BigDecimal totalRevenue;

    public RevenueReportResponse(BigDecimal totalAdvance, BigDecimal totalBalance, BigDecimal totalRevenue) {
        this.totalAdvance = totalAdvance;
        this.totalBalance = totalBalance;
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getTotalAdvance() {
        return totalAdvance;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
}
