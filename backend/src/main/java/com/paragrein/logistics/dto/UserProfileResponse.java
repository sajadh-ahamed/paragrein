package com.paragrein.logistics.dto;

public class UserProfileResponse {

    private Long userId;
    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private String role;
    private String accountStatus;

    public UserProfileResponse(Long userId, String fullName, String username, String email, String phoneNumber, String role, String accountStatus) {
        this.userId = userId;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.accountStatus = accountStatus;
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

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getRole() {
        return role;
    }

    public String getAccountStatus() {
        return accountStatus;
    }
}
