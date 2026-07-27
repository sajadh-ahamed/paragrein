package com.paragrein.logistics.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ReportFilterRequest {

    private LocalDate dateFrom;
    private LocalDate dateTo;
    private String status;
    private String role;
    private Long employeeId;
    private String reportType;
}
