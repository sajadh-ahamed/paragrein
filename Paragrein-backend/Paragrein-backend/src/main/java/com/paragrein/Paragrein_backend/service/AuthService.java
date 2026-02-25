package com.paragrein.Paragrein_backend.service;

import com.paragrein.Paragrein_backend.dto.*;

public interface AuthService {
    ApiMessageResponse registerCustomer(RegisterCustomerRequest request);

    LoginResponse login(LoginRequest request);

    ApiMessageResponse forgotPassword(ForgotPasswordRequest request);

    ApiMessageResponse resetPassword(ResetPasswordRequest request);
}
