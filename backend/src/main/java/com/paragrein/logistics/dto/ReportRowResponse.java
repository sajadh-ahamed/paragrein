package com.paragrein.logistics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReportRowResponse {

    private String trackingNumber;
    private String customerName;
    private String reference;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
