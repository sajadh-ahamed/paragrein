package com.paragrein.logistics.dto;

import com.paragrein.logistics.enums.AccountStatus;
import com.paragrein.logistics.enums.AvailabilityStatus;
import com.paragrein.logistics.enums.RoleCode;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeRequest {

    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private String password;
    private String confirmPassword;
    private RoleCode roleCode;
    private String designation;
    private String employeeNumber;
    private LocalDate joinedDate;
    private String profileImagePath;
    private AccountStatus accountStatus;
    private AvailabilityStatus availabilityStatus;
}
