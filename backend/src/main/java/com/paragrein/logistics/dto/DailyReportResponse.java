package com.paragrein.logistics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DailyReportResponse {

    private LocalDate reportDate;
    private ReportSummaryResponse summary;
    private long ordersCreated;
    private long ordersDelivered;
    private BigDecimal revenueCollected;
}
