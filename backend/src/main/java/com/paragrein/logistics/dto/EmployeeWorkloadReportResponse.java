package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.EmployeeProfile;
import com.paragrein.logistics.enums.AvailabilityStatus;
import com.paragrein.logistics.enums.RoleCode;

public class EmployeeWorkloadReportResponse {

    private Long employeeUserId;
    private String employeeName;
    private RoleCode role;
    private String employeeNumber;
    private long assignedCount;
    private long acceptedCount;
    private long completedCount;
    private AvailabilityStatus currentAvailability;

    public EmployeeWorkloadReportResponse(EmployeeProfile profile, long assignedCount, long acceptedCount, long completedCount) {
        this.employeeUserId = profile.getUser().getId();
        this.employeeName = profile.getUser().getFullName();
        this.role = profile.getUser().getRole().getCode();
        this.employeeNumber = profile.getEmployeeNumber();
        this.assignedCount = assignedCount;
        this.acceptedCount = acceptedCount;
        this.completedCount = completedCount;
        this.currentAvailability = profile.getAvailabilityStatus();
    }

    public Long getEmployeeUserId() {
        return employeeUserId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public RoleCode getRole() {
        return role;
    }

    public String getEmployeeNumber() {
        return employeeNumber;
    }

    public long getAssignedCount() {
        return assignedCount;
    }

    public long getAcceptedCount() {
        return acceptedCount;
    }

    public long getCompletedCount() {
        return completedCount;
    }

    public AvailabilityStatus getCurrentAvailability() {
        return currentAvailability;
    }
}
