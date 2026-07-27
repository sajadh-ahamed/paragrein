package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.EmployeeProfile;
import com.paragrein.logistics.enums.AccountStatus;
import com.paragrein.logistics.enums.AvailabilityStatus;
import com.paragrein.logistics.enums.RoleCode;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeProfileRepository extends JpaRepository<EmployeeProfile, Long> {

    boolean existsByEmployeeNumber(String employeeNumber);

    @EntityGraph(attributePaths = {"user", "user.role"})
    Optional<EmployeeProfile> findByUserId(Long userId);

    @Override
    @EntityGraph(attributePaths = {"user", "user.role"})
    List<EmployeeProfile> findAll();

    @EntityGraph(attributePaths = {"user", "user.role"})
    List<EmployeeProfile> findByUser_Role_Code(RoleCode roleCode);

    @EntityGraph(attributePaths = {"user", "user.role"})
    List<EmployeeProfile> findByUser_Role_CodeAndUser_AccountStatusAndAvailabilityStatus(
            RoleCode roleCode,
            AccountStatus accountStatus,
            AvailabilityStatus availabilityStatus
    );

    long countByUser_AccountStatus(AccountStatus accountStatus);
}
