package com.paragrein.Paragrein_backend.util;

import com.paragrein.Paragrein_backend.entity.Role;
import com.paragrein.Paragrein_backend.entity.User;
import com.paragrein.Paragrein_backend.repository.RoleRepository;
import com.paragrein.Paragrein_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Set;

@Component
public class AdminDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.seed-enabled:true}")
    private boolean seedEnabled;

    @Value("${app.admin.email:admin@gmail.com}")
    private String adminEmail;

    @Value("${app.admin.password:admin1234}")
    private String adminPassword;

    @Value("${app.admin.username:System Admin}")
    private String adminUsername;

    @Value("${app.admin.nic:ADMIN0001}")
    private String adminNic;

    @Value("${app.admin.phone:0000000000}")
    private String adminPhone;

    public AdminDataInitializer(UserRepository userRepository,
                                RoleRepository roleRepository,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled || userRepository.existsByEmail(adminEmail)) {
            return;
        }

        Role adminRole = roleRepository.findByName(RoleConstants.ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(null, RoleConstants.ADMIN)));

        User adminUser = new User();
        adminUser.setUsername(adminUsername);
        adminUser.setEmail(adminEmail);
        adminUser.setNic(adminNic);
        adminUser.setPassword(passwordEncoder.encode(adminPassword));
        adminUser.setPhone(adminPhone);
        adminUser.setStatus("ACTIVE");
        adminUser.setCreatedAt(LocalDateTime.now());
        adminUser.setRoles(Set.of(adminRole));

        userRepository.save(adminUser);
    }
}
