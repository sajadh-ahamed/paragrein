package com.paragrein.Paragrein_backend.service.impl;

import com.paragrein.Paragrein_backend.dto.*;
import com.paragrein.Paragrein_backend.entity.Customer;
import com.paragrein.Paragrein_backend.entity.Role;
import com.paragrein.Paragrein_backend.entity.User;
import com.paragrein.Paragrein_backend.repository.CustomerRepository;
import com.paragrein.Paragrein_backend.repository.RoleRepository;
import com.paragrein.Paragrein_backend.repository.UserRepository;
import com.paragrein.Paragrein_backend.security.JwtUtil;
import com.paragrein.Paragrein_backend.service.AuthService;
import com.paragrein.Paragrein_backend.service.EmailDomainValidationService;
import com.paragrein.Paragrein_backend.service.PasswordResetService;
import com.paragrein.Paragrein_backend.util.RoleConstants;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordResetService passwordResetService;
    private final EmailDomainValidationService emailDomainValidationService;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           CustomerRepository customerRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtUtil jwtUtil,
                           PasswordResetService passwordResetService,
                           EmailDomainValidationService emailDomainValidationService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordResetService = passwordResetService;
        this.emailDomainValidationService = emailDomainValidationService;
    }

    @Override
    @Transactional
    public ApiMessageResponse registerCustomer(RegisterCustomerRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirm password do not match.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        if (!emailDomainValidationService.hasDeliverableDomain(request.getEmail())) {
            throw new IllegalArgumentException("Email domain is invalid or unreachable. Please use a valid email.");
        }

        Role customerRole = roleRepository.findByName(RoleConstants.CUSTOMER)
                .orElseGet(() -> roleRepository.save(new Role(null, RoleConstants.CUSTOMER)));

        User user = new User();
        user.setUsername(request.getFullName());
        user.setEmail(request.getEmail());
        user.setNic(null);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setStatus("ACTIVE");
        user.setCreatedAt(LocalDateTime.now());
        user.setRoles(Set.of(customerRole));

        User savedUser = userRepository.save(user);

        Customer customer = new Customer();
        customer.setAddress(request.getAddress());
        customer.setUser(savedUser);
        customerRepository.save(customer);

        return new ApiMessageResponse("Customer registered successfully.");
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user;
        if (StringUtils.hasText(request.getEmail()) && StringUtils.hasText(request.getNic())) {
            user = userRepository.findByEmailAndNic(request.getEmail(), request.getNic())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials."));
        } else {
            if (!StringUtils.hasText(request.getIdentifier())) {
            throw new IllegalArgumentException("Provide login identifier or both email and NIC.");
            }
            user = userRepository.findByEmail(request.getIdentifier())
                .or(() -> userRepository.findByNic(request.getIdentifier()))
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials."));
        }

        Set<String> roleNames = user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toSet());

        boolean isWorker = roleNames.stream().anyMatch(RoleConstants.WORKER_ROLES::contains);
        if (isWorker && !(StringUtils.hasText(request.getEmail()) && StringUtils.hasText(request.getNic()))) {
            throw new BadCredentialsException("Workers must login using both email and NIC.");
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new IllegalArgumentException("User account is inactive.");
        }

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );

        String primaryRole = roleNames.contains(RoleConstants.ADMIN)
            ? RoleConstants.ADMIN
            : roleNames.contains(RoleConstants.CUSTOMER)
            ? RoleConstants.CUSTOMER
            : roleNames.stream().findFirst().orElse(RoleConstants.CUSTOMER);

        String token = jwtUtil.generateToken(user.getEmail(), user.getUsername(), roleNames);

        String message = RoleConstants.CUSTOMER.equals(primaryRole)
            ? "Hello Customer, login successful"
            : RoleConstants.ADMIN.equals(primaryRole)
            ? "Hello Admin, login successful"
            : "Hello " + user.getUsername() + ", Role: " + primaryRole + ", login successful";

        return new LoginResponse(token, primaryRole, user.getUsername(), message);
    }

    @Override
    public ApiMessageResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user != null) {
            boolean isAdmin = user.getRoles().stream().map(Role::getName).anyMatch(RoleConstants.ADMIN::equals);
            if (isAdmin) {
                throw new IllegalArgumentException("Admin password must be reset manually.");
            }
            passwordResetService.createAndSendToken(user);
        }

        return new ApiMessageResponse("If your email exists, a password reset link has been sent.");
    }

    @Override
    public ApiMessageResponse resetPassword(ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return new ApiMessageResponse("Password has been reset successfully.");
    }
}
