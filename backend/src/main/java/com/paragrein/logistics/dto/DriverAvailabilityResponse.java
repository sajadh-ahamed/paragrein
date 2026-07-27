package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.EmployeeProfile;
import com.paragrein.logistics.enums.AccountStatus;
import com.paragrein.logistics.enums.AvailabilityStatus;

public class DriverAvailabilityResponse {

    private Long userId;
    private String fullName;
    private String username;
    private String employeeNumber;
    private String designation;
    private String phoneNumber;
    private AccountStatus accountStatus;
    private AvailabilityStatus availabilityStatus;

    public DriverAvailabilityResponse(EmployeeProfile profile) {
        this.userId = profile.getUser().getId();
        this.fullName = profile.getUser().getFullName();
        this.username = profile.getUser().getUsername();
        this.employeeNumber = profile.getEmployeeNumber();
        this.designation = profile.getDesignation();
        this.phoneNumber = profile.getUser().getPhoneNumber();
        this.accountStatus = profile.getUser().getAccountStatus();
        this.availabilityStatus = profile.getAvailabilityStatus();
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

    public String getDesignation() {
        return designation;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public AvailabilityStatus getAvailabilityStatus() {
        return availabilityStatus;
    }
}
