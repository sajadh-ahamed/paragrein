package com.paragrein.Paragrein_backend.util;

import com.paragrein.Paragrein_backend.entity.Role;
import com.paragrein.Paragrein_backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RoleDataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleDataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        List<String> allRoles = new ArrayList<>();
        allRoles.add(RoleConstants.ADMIN);
        allRoles.add(RoleConstants.CUSTOMER);
        allRoles.addAll(RoleConstants.WORKER_ROLES);

        for (String roleName : allRoles) {
            roleRepository.findByName(roleName)
                    .orElseGet(() -> roleRepository.save(new Role(null, roleName)));
        }
    }
}
