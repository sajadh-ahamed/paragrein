package com.paragrein.logistics.dto;

import com.paragrein.logistics.enums.IssueSeverity;
import lombok.Data;

@Data
public class IssueReportRequest {

    private String title;
    private String description;
    private IssueSeverity severity;
    //private IssueSeverity explain;
}
