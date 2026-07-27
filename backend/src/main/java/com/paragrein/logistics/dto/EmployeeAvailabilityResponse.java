package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.EmployeeProfile;
import com.paragrein.logistics.enums.AccountStatus;
import com.paragrein.logistics.enums.AvailabilityStatus;
import com.paragrein.logistics.enums.RoleCode;

public class EmployeeAvailabilityResponse {

    private Long userId;
    private String fullName;
    private String username;
    private String employeeNumber;
    private RoleCode roleCode;
    private AccountStatus accountStatus;
    private AvailabilityStatus availabilityStatus;
    private String designation;

    public EmployeeAvailabilityResponse(EmployeeProfile profile) {
        this.userId = profile.getUser().getId();
        this.fullName = profile.getUser().getFullName();
        this.username = profile.getUser().getUsername();
        this.employeeNumber = profile.getEmployeeNumber();
        this.roleCode = profile.getUser().getRole().getCode();
        this.accountStatus = profile.getUser().getAccountStatus();
        this.availabilityStatus = profile.getAvailabilityStatus();
        this.designation = profile.getDesignation();
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getUsername() {
        return username;
    }

    public String getEmployeeNumber() {
        return employeeNumber;
    }

    public RoleCode getRoleCode() {
        return roleCode;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public AvailabilityStatus getAvailabilityStatus() {
        return availabilityStatus;
    }

    public String getDesignation() {
        return designation;
    }
}
