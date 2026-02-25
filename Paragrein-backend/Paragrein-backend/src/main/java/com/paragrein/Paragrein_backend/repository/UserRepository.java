package com.paragrein.Paragrein_backend.repository;

import com.paragrein.Paragrein_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndNic(String email, String nic);

    Optional<User> findByNic(String nic);

    boolean existsByEmail(String email);

    boolean existsByNic(String nic);
}