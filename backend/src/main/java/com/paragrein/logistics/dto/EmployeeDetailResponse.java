package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.EmployeeProfile;

public class EmployeeDetailResponse extends EmployeeResponse {

    private String profileImagePath;

    public EmployeeDetailResponse(EmployeeProfile profile) {
        super(profile);
        this.profileImagePath = profile.getUser().getProfileImagePath();
    }

    public String getProfileImagePath() {
        return profileImagePath;
    }
}
