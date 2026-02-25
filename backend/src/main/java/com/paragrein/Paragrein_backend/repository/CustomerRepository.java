package com.paragrein.Paragrein_backend.repository;

import com.paragrein.Paragrein_backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
