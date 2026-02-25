package com.paragrein.Paragrein_backend.service;

import com.paragrein.Paragrein_backend.entity.User;

public interface PasswordResetService {
    void createAndSendToken(User user);

    void resetPassword(String token, String newPassword);
}
