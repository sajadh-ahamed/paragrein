package com.paragrein.logistics.security;

import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

public final class SecurityUserUtil {

    private SecurityUserUtil() {
    }

    public static User requireCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AppException("Authenticated user not found.", HttpStatus.UNAUTHORIZED);
        }
        return userDetails.getUser();
    }
}
