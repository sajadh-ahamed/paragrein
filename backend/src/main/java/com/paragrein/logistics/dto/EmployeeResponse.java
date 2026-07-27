package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.EmployeeProfile;
import com.paragrein.logistics.enums.AccountStatus;
import com.paragrein.logistics.enums.AvailabilityStatus;
import com.paragrein.logistics.enums.RoleCode;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class EmployeeResponse {

    private Long id;
    private Long userId;
    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private RoleCode roleCode;
    private AccountStatus accountStatus;
    private String employeeNumber;
    private AvailabilityStatus availabilityStatus;
    private String designation;
    private LocalDate joinedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EmployeeResponse(EmployeeProfile profile) {
        this.id = profile.getId();
        this.userId = profile.getUser().getId();
        this.fullName = profile.getUser().getFullName();
        this.username = profile.getUser().getUsername();
        this.email = profile.getUser().getEmail();
        this.phoneNumber = profile.getUser().getPhoneNumber();
        this.roleCode = profile.getUser().getRole().getCode();
        this.accountStatus = profile.getUser().getAccountStatus();
        this.employeeNumber = profile.getEmployeeNumber();
        this.availabilityStatus = profile.getAvailabilityStatus();
        this.designation = profile.getDesignation();
        this.joinedDate = profile.getJoinedDate();
        this.createdAt = profile.getCreatedAt();
        this.updatedAt = profile.getUpdatedAt();
    }
}
