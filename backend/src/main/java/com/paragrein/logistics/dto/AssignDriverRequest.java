package com.paragrein.logistics.dto;

import lombok.Data;

@Data
public class AssignDriverRequest {

    private Long driverUserId;
    private String note;
}
