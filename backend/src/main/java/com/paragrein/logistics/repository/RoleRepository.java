package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.Role;
import com.paragrein.logistics.enums.RoleCode;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByCode(RoleCode code);
}
