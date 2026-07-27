package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.enums.RoleCode;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = "role")
    Optional<User> findByUsernameOrEmail(String username, String email);

    Optional<User> findByEmailIgnoreCase(String email);

    @Override
    @EntityGraph(attributePaths = "role")
    Optional<User> findById(Long id);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<User> findByRole_Code(RoleCode roleCode);
}
