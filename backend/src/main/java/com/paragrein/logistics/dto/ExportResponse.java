package com.paragrein.logistics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExportResponse {

    private String fileName;
    private String contentType;
    private long rowCount;
}
