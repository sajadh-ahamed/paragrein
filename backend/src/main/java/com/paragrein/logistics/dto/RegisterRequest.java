package com.paragrein.logistics.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private String password;
    private String confirmPassword;
}
