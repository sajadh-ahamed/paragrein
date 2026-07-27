package com.paragrein.logistics.controller;

/*This is the REST Controller for authentication.
  It receives HTTP requests from the React frontend and forwards them to the appropriate service classes.
  The controller does not contain business logic; it only handles request routing and response returning. */

import com.paragrein.logistics.dto.ForgotPasswordRequest;
import com.paragrein.logistics.dto.LoginRequest;
import com.paragrein.logistics.dto.LoginResponse;
import com.paragrein.logistics.dto.MessageResponse;
import com.paragrein.logistics.dto.RegisterRequest;
import com.paragrein.logistics.dto.ResetPasswordRequest;
import com.paragrein.logistics.dto.UserProfileResponse;
import com.paragrein.logistics.service.AuthService;
import com.paragrein.logistics.service.PasswordResetService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController //This class is a REST API Controller.
@RequestMapping("/api/auth") //can change url
public class AuthController {

    //creating objects using Dependency injection instead of creating new class
    //It is just a variable that can hold a Student object.
    private final AuthService authService; //after constructor initializes them they cannot point to another object.
    private final PasswordResetService passwordResetService;

    //creating constructors
    //passing values in future now we just
    //left side class variable and right side object name
    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }
//steps
    //recieved username ="sajadh" , password = "123"
    //run the login method in that put those values into  dto object (LoginRequest)
    //as we mentioned earlier we need to return LoginResponse its a dto with attibutes
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserProfileResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/forgot-password")
    public MessageResponse forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return passwordResetService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(@RequestBody ResetPasswordRequest request) {
        return passwordResetService.resetPassword(request);
    }

    @GetMapping("/me")
    public UserProfileResponse me(Authentication authentication) {
        return authService.getCurrentUser(authentication);
    }
}
