package com.paragrein.Paragrein_backend.service.impl;

import com.paragrein.Paragrein_backend.dto.ApiMessageResponse;
import com.paragrein.Paragrein_backend.dto.AdminUserResponse;
import com.paragrein.Paragrein_backend.dto.CreateWorkerRequest;
import com.paragrein.Paragrein_backend.entity.Driver;
import com.paragrein.Paragrein_backend.entity.Role;
import com.paragrein.Paragrein_backend.entity.User;
import com.paragrein.Paragrein_backend.repository.DriverRepository;
import com.paragrein.Paragrein_backend.repository.RoleRepository;
import com.paragrein.Paragrein_backend.repository.UserRepository;
import com.paragrein.Paragrein_backend.service.AdminService;
import com.paragrein.Paragrein_backend.service.EmailDomainValidationService;
import com.paragrein.Paragrein_backend.service.EmailService;
import com.paragrein.Paragrein_backend.util.RoleConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminServiceImpl.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DriverRepository driverRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final EmailDomainValidationService emailDomainValidationService;

    public AdminServiceImpl(UserRepository userRepository,
                            RoleRepository roleRepository,
                            DriverRepository driverRepository,
                            PasswordEncoder passwordEncoder,
                            EmailService emailService,
                            EmailDomainValidationService emailDomainValidationService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.driverRepository = driverRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.emailDomainValidationService = emailDomainValidationService;
    }

    @Override
    @Transactional
    public ApiMessageResponse createWorker(CreateWorkerRequest request) {
        String normalizedRole = request.getRole().toUpperCase(Locale.ROOT).trim();
        String normalizedStatus = StringUtils.hasText(request.getStatus())
                ? request.getStatus().toUpperCase(Locale.ROOT).trim()
                : "ACTIVE";

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirm password do not match.");
        }

        if (!RoleConstants.WORKER_ROLES.contains(normalizedRole)) {
            throw new IllegalArgumentException("Invalid worker role.");
        }
        if (!("ACTIVE".equals(normalizedStatus) || "INACTIVE".equals(normalizedStatus))) {
            throw new IllegalArgumentException("Worker status must be ACTIVE or INACTIVE.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }
        if (!emailDomainValidationService.hasDeliverableDomain(request.getEmail())) {
            throw new IllegalArgumentException("Email domain is invalid or unreachable. Please use a valid email.");
        }
        if (userRepository.existsByNic(request.getNic())) {
            throw new IllegalArgumentException("NIC is already registered.");
        }

        Role role = roleRepository.findByName(normalizedRole)
                .orElseGet(() -> roleRepository.save(new Role(null, normalizedRole)));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setNic(request.getNic());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus(normalizedStatus);
        user.setCreatedAt(LocalDateTime.now());
        user.setRoles(Set.of(role));

        User savedUser = userRepository.save(user);

        if (RoleConstants.DRIVER.equals(normalizedRole)) {
            Driver driver = new Driver();
            driver.setUser(savedUser);
            driver.setAvailabilityStatus("AVAILABLE");
            driver.setLicenseNumber("PENDING");
            driverRepository.save(driver);
        }

        String subject = "Welcome to Paragrein Logistics";
        String body = "Dear " + request.getUsername() + ",\n\n"
                + "You have been registered as " + normalizedRole + " in Paragrein Logistics.\n\n"
                + "Login Credentials:\n"
                + "NIC: " + request.getNic() + "\n"
                + "Email: " + request.getEmail() + "\n"
                + "Password: " + request.getPassword() + "\n\n"
            + "Address: " + request.getAddress() + "\n\n"
                + "Please login and change your password immediately.\n\n"
                + "Regards,\nParagrein Admin";

        try {
            emailService.sendEmail(request.getEmail(), subject, body);
        } catch (Exception ex) {
            log.warn("Worker created, but welcome email failed for {}: {}", request.getEmail(), ex.getMessage());
        }

        return new ApiMessageResponse("Worker created successfully.");
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new AdminUserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getNic(),
                        user.getPhone(),
                        user.getStatus(),
                        user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
                ))
                .collect(Collectors.toList());
    }
}
