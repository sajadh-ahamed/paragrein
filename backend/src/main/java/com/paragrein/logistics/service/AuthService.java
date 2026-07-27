package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.LoginRequest;
import com.paragrein.logistics.dto.LoginResponse;
import com.paragrein.logistics.dto.RegisterRequest;
import com.paragrein.logistics.dto.UserProfileResponse;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.Role;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.enums.AccountStatus;
import com.paragrein.logistics.enums.RoleCode;
import com.paragrein.logistics.exception.AuthException;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.RoleRepository;
import com.paragrein.logistics.repository.UserRepository;
import com.paragrein.logistics.security.CustomUserDetails;
import com.paragrein.logistics.security.JwtTokenProvider;
import com.paragrein.logistics.security.PasswordPolicy;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            AuditLogRepository auditLogRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

//    @Transactional - If everything succeeds, the changes are committed. If an exception occurs, the transaction is rolled back.
    @Transactional
    public LoginResponse login(LoginRequest request) {
        String usernameOrEmail = clean(request.getUsernameOrEmail());
        String password = request.getPassword();

        if (isBlank(usernameOrEmail) || isBlank(password)) {
            throw new AuthException("Username/email and password are required.", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail).orElse(null);
        if (user == null) {
            saveAudit(null, "LOGIN_FAILED", "User", null, "Failed login attempt for unknown username/email: " + usernameOrEmail);
            throw invalidCredentials();
        }

        // Security note: inactive and suspended accounts cannot receive JWT tokens.
        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            saveAudit(user, "LOGIN_FAILED", "User", user.getId(), "Blocked login attempt for non-active account.");
            throw new AuthException("This account is not active. Please contact the administrator.", HttpStatus.FORBIDDEN);
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            saveAudit(user, "LOGIN_FAILED", "User", user.getId(), "Failed login attempt due to invalid password.");
            throw invalidCredentials();
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtTokenProvider.generateToken(userDetails);
        saveAudit(user, "LOGIN_SUCCESS", "User", user.getId(), "User logged in successfully.");

        return new LoginResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getCode().name()
        );
    }

    @Transactional
    public UserProfileResponse register(RegisterRequest request) {
        validateRegistration(request);

        Role customerRole = roleRepository.findByCode(RoleCode.CUSTOMER)
                .orElseThrow(() -> new AuthException("Customer role is not configured.", HttpStatus.INTERNAL_SERVER_ERROR));

        User user = new User();
        user.setFullName(clean(request.getFullName()));
        user.setUsername(clean(request.getUsername()));
        user.setEmail(clean(request.getEmail()).toLowerCase());
        user.setPhoneNumber(clean(request.getPhoneNumber()));
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(customerRole);
        user.setAccountStatus(AccountStatus.ACTIVE);

        User savedUser = userRepository.save(user);
        saveAudit(savedUser, "CUSTOMER_REGISTERED", "User", savedUser.getId(), "Customer account registered.");
        return toProfileResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AuthException("Authenticated user not found.", HttpStatus.UNAUTHORIZED);
        }
        return toProfileResponse(userDetails.getUser());
    }

    private void validateRegistration(RegisterRequest request) {
        if (isBlank(request.getFullName()) || isBlank(request.getUsername()) || isBlank(request.getEmail())
                || isBlank(request.getPassword()) || isBlank(request.getConfirmPassword())) {
            throw new AuthException("Full name, username, email, password, and confirm password are required.", HttpStatus.BAD_REQUEST);
        }

        // Validation rule: public registration always creates CUSTOMER accounts and cannot choose employee/admin roles.
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AuthException("Password and confirm password do not match.", HttpStatus.BAD_REQUEST);
        }

        if (!PasswordPolicy.isStrong(request.getPassword())) {
            throw new AuthException(PasswordPolicy.REQUIREMENTS, HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByUsername(clean(request.getUsername()))) {
            throw new AuthException("Username is already taken.", HttpStatus.CONFLICT);
        }

        if (userRepository.existsByEmail(clean(request.getEmail()).toLowerCase())) {
            throw new AuthException("Email is already taken.", HttpStatus.CONFLICT);
        }
    }

    private UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole().getCode().name(),
                user.getAccountStatus().name()
        );
    }

    private void saveAudit(User user, String action, String entityType, Long entityId, String description) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUser(user);
        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setDescription(description);
        auditLogRepository.save(auditLog);
    }

    private AuthException invalidCredentials() {
        return new AuthException("Invalid username/email or password.", HttpStatus.UNAUTHORIZED);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}
