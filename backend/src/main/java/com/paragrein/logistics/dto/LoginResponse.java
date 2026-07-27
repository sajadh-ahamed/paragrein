package com.paragrein.logistics.dto;

import lombok.Data;

@Data
public class LoginResponse {

    private String token;
    private String tokenType;
    private Long userId;
    private String fullName;
    private String username;
    private String email;
    private String role;

    public LoginResponse(String token, Long userId, String fullName, String username, String email, String role) {
        this.token = token;
        this.tokenType = "Bearer";
        this.userId = userId;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}
