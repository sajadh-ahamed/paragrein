package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.EmployeeDetailResponse;
import com.paragrein.logistics.dto.EmployeeRequest;
import com.paragrein.logistics.dto.EmployeeResponse;
import com.paragrein.logistics.dto.EmployeeAvailabilityResponse;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.EmployeeProfile;
import com.paragrein.logistics.entity.Role;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.enums.AccountStatus;
import com.paragrein.logistics.enums.AvailabilityStatus;
import com.paragrein.logistics.enums.RoleCode;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.EmployeeProfileRepository;
import com.paragrein.logistics.repository.RoleRepository;
import com.paragrein.logistics.repository.UserRepository;
import com.paragrein.logistics.security.SecurityUserUtil;
import com.paragrein.logistics.security.PasswordPolicy;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeManagementService {

    private static final Set<RoleCode> EMPLOYEE_ROLES = Set.of(
            RoleCode.ADMIN,
            RoleCode.FINANCE_OFFICER,
            RoleCode.PICKUP_AGENT,
            RoleCode.WAREHOUSE_STAFF,
            RoleCode.DRIVER);

    private final EmployeeProfileRepository employeeProfileRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeManagementService(
            EmployeeProfileRepository employeeProfileRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            AuditLogRepository auditLogRepository,
            PasswordEncoder passwordEncoder) {
        this.employeeProfileRepository = employeeProfileRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> listEmployees() {
        return employeeProfileRepository.findAll().stream()
                .map(EmployeeResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> searchEmployees(String query, RoleCode roleCode, AccountStatus accountStatus,
            AvailabilityStatus availabilityStatus) {
        String normalizedQuery = clean(query) == null ? "" : clean(query).toLowerCase(Locale.ROOT);
        return employeeProfileRepository.findAll().stream()
                .filter(profile -> roleCode == null || profile.getUser().getRole().getCode() == roleCode)
                .filter(profile -> accountStatus == null || profile.getUser().getAccountStatus() == accountStatus)
                .filter(profile -> availabilityStatus == null || profile.getAvailabilityStatus() == availabilityStatus)
                .filter(profile -> normalizedQuery.isBlank() || matchesSearch(profile, normalizedQuery))
                .map(EmployeeResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmployeeDetailResponse getEmployeeDetail(Long userId) {
        return new EmployeeDetailResponse(findProfileByUserId(userId));
    }

    @Transactional
    public EmployeeDetailResponse createEmployee(EmployeeRequest request, Authentication authentication) {
        User admin = SecurityUserUtil.requireCurrentUser(authentication);
        validateCreateRequest(request);

        Role role = roleRepository.findByCode(request.getRoleCode())
                .orElseThrow(() -> new AppException("Selected role is not configured.", HttpStatus.BAD_REQUEST));

        User user = new User();
        user.setFullName(clean(request.getFullName()));
        user.setUsername(clean(request.getUsername()));
        user.setEmail(clean(request.getEmail()).toLowerCase(Locale.ROOT));
        user.setPhoneNumber(clean(request.getPhoneNumber()));
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setProfileImagePath(clean(request.getProfileImagePath()));
        User savedUser = userRepository.save(user);

        EmployeeProfile profile = new EmployeeProfile();
        profile.setUser(savedUser);
        profile.setEmployeeNumber(generateEmployeeNumber());
        profile.setDesignation(clean(request.getDesignation()));
        profile.setJoinedDate(request.getJoinedDate());
        profile.setAvailabilityStatus(defaultAvailabilityFor(request.getRoleCode()));
        EmployeeProfile savedProfile = employeeProfileRepository.save(profile);

        saveAudit(admin, "EMPLOYEE_CREATED", "User", savedUser.getId(),
                "Created employee account " + savedUser.getUsername());
        return new EmployeeDetailResponse(savedProfile);
    }

    @Transactional
    public EmployeeDetailResponse updateEmployee(Long userId, EmployeeRequest request, Authentication authentication) {
        User admin = SecurityUserUtil.requireCurrentUser(authentication);
        EmployeeProfile profile = findProfileByUserId(userId);
        User user = profile.getUser();

        requireText(request.getFullName(), "Full name is required.");
        requireText(request.getPhoneNumber(), "Phone number is required.");
        requireText(request.getDesignation(), "Designation is required.");

        user.setFullName(clean(request.getFullName()));
        user.setPhoneNumber(clean(request.getPhoneNumber()));
        if (request.getAccountStatus() != null) {
            user.setAccountStatus(request.getAccountStatus());
        }
        profile.setDesignation(clean(request.getDesignation()));
        if (request.getAvailabilityStatus() != null) {
            profile.setAvailabilityStatus(request.getAvailabilityStatus());
        }

        User savedUser = userRepository.save(user);
        EmployeeProfile savedProfile = employeeProfileRepository.save(profile);
        saveAudit(admin, "EMPLOYEE_UPDATED", "User", savedUser.getId(),
                "Updated employee account " + savedUser.getUsername());
        return new EmployeeDetailResponse(savedProfile);
    }

    @Transactional
    public EmployeeDetailResponse activateEmployee(Long userId, Authentication authentication) {
        User admin = SecurityUserUtil.requireCurrentUser(authentication);
        EmployeeProfile profile = findProfileByUserId(userId);
        profile.getUser().setAccountStatus(AccountStatus.ACTIVE);
        if (profile.getAvailabilityStatus() == AvailabilityStatus.OFFLINE) {
            profile.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        }
        EmployeeProfile saved = employeeProfileRepository.save(profile);
        saveAudit(admin, "EMPLOYEE_ACTIVATED", "User", profile.getUser().getId(),
                "Activated employee account " + profile.getUser().getUsername());
        return new EmployeeDetailResponse(saved);
    }

    @Transactional
    public EmployeeDetailResponse deactivateEmployee(Long userId, Authentication authentication) {
        User admin = SecurityUserUtil.requireCurrentUser(authentication);
        EmployeeProfile profile = findProfileByUserId(userId);
        profile.getUser().setAccountStatus(AccountStatus.INACTIVE);
        profile.setAvailabilityStatus(AvailabilityStatus.OFFLINE);
        EmployeeProfile saved = employeeProfileRepository.save(profile);
        saveAudit(admin, "EMPLOYEE_DEACTIVATED", "User", profile.getUser().getId(),
                "Deactivated employee account " + profile.getUser().getUsername());
        return new EmployeeDetailResponse(saved);
    }

    @Transactional
    public void deleteEmployee(Long userId, Authentication authentication) {

        User admin = SecurityUserUtil.requireCurrentUser(authentication);

        EmployeeProfile profile = findProfileByUserId(userId);

        User employee = profile.getUser();

        if (employee.getAccountStatus() != AccountStatus.INACTIVE) {
            throw new AppException(
                    "Only inactive employees can be deleted.",
                    HttpStatus.BAD_REQUEST);
        }

        auditLogRepository.deleteByUser(employee);

        employeeProfileRepository.delete(profile);

        userRepository.delete(employee);

        saveAudit(
                admin,
                "EMPLOYEE_DELETED",
                "User",
                userId,
                "Deleted employee account " + employee.getUsername());
    }



    @Transactional(readOnly = true)
    public List<EmployeeAvailabilityResponse> listAvailablePickupAgents() {
        return availableWorkers(RoleCode.PICKUP_AGENT);
    }

    @Transactional(readOnly = true)
    public List<EmployeeAvailabilityResponse> listAvailableDrivers() {
        return availableWorkers(RoleCode.DRIVER);
    }

    private List<EmployeeAvailabilityResponse> availableWorkers(RoleCode roleCode) {
        return employeeProfileRepository.findByUser_Role_CodeAndUser_AccountStatusAndAvailabilityStatus(
                roleCode,
                AccountStatus.ACTIVE,
                AvailabilityStatus.AVAILABLE).stream()
                .map(EmployeeAvailabilityResponse::new)
                .toList();
    }

    private EmployeeProfile findProfileByUserId(Long userId) {
        return employeeProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException("Employee not found.", HttpStatus.NOT_FOUND));
    }

    private void validateCreateRequest(EmployeeRequest request) {
        if (request == null) {
            throw new AppException("Employee details are required.", HttpStatus.BAD_REQUEST);
        }
        requireText(request.getFullName(), "Full name is required.");
        requireText(request.getUsername(), "Username is required.");

        String email = clean(request.getEmail());
        requireText(email, "Email is required.");
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new AppException("Please enter a valid email address.", HttpStatus.BAD_REQUEST);
        }

        String phone = clean(request.getPhoneNumber());
        requireText(phone, "Phone number is required.");
        if (!phone.matches("^0\\d{9}$")) {
            throw new AppException("Phone number must be 10 digits long and start with 0.", HttpStatus.BAD_REQUEST);
        }

        requireText(request.getPassword(), "Password is required.");
        requireText(request.getConfirmPassword(), "Confirm password is required.");
        requireText(request.getDesignation(), "Designation is required.");
        if (request.getJoinedDate() == null) {
            throw new AppException("Joined date is required.", HttpStatus.BAD_REQUEST);
        }
        if (request.getJoinedDate().getYear() < 1900 || request.getJoinedDate().getYear() > 2100) {
            throw new AppException("Joined date must be between years 1900 and 2100.", HttpStatus.BAD_REQUEST);
        }
        if (request.getRoleCode() == null || !EMPLOYEE_ROLES.contains(request.getRoleCode())) {
            throw new AppException("A valid employee role is required.", HttpStatus.BAD_REQUEST);
        }
        // Business rule: public/customer accounts are never created through the
        // employee workflow.
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException("Password and confirm password do not match.", HttpStatus.BAD_REQUEST);
        }
        if (!PasswordPolicy.isStrong(request.getPassword())) {
            throw new AppException(PasswordPolicy.REQUIREMENTS, HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByUsername(clean(request.getUsername()))) {
            throw new AppException("Username is already taken.", HttpStatus.CONFLICT);
        }
        if (userRepository.existsByEmail(email.toLowerCase(Locale.ROOT))) {
            throw new AppException("Email is already taken.", HttpStatus.CONFLICT);
        }
    }

    private AvailabilityStatus defaultAvailabilityFor(RoleCode roleCode) {
        if (roleCode == RoleCode.PICKUP_AGENT || roleCode == RoleCode.DRIVER) {
            return AvailabilityStatus.AVAILABLE;
        }
        return AvailabilityStatus.AVAILABLE;
    }

    private boolean matchesSearch(EmployeeProfile profile, String query) {
        return contains(profile.getUser().getFullName(), query)
                || contains(profile.getUser().getUsername(), query)
                || contains(profile.getUser().getEmail(), query)
                || contains(profile.getEmployeeNumber(), query);
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(query);
    }

    private String generateEmployeeNumber() {
        List<EmployeeProfile> profiles = employeeProfileRepository.findAll();
        int maxNum = 0;
        for (EmployeeProfile p : profiles) {
            String numStr = p.getEmployeeNumber();
            if (numStr != null) {
                String digits = numStr.replaceAll("[^0-9]", "");
                if (!digits.isEmpty()) {
                    try {
                        int num = Integer.parseInt(digits);
                        if (num > maxNum) {
                            maxNum = num;
                        }
                    } catch (NumberFormatException e) {
                        // ignore
                    }
                }
            }
        }
        int nextNum = maxNum + 1;
        return String.format("EMP%03d", nextNum);
    }

    private void requireText(String value, String message) {
        if (isBlank(value)) {
            throw new AppException(message, HttpStatus.BAD_REQUEST);
        }
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

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}
