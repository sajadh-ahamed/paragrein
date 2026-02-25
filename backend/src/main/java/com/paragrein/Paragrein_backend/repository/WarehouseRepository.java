package com.paragrein.Paragrein_backend.repository;

import com.paragrein.Paragrein_backend.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    Warehouse findByName(String name);
    Warehouse findByLocation(String location);
}
