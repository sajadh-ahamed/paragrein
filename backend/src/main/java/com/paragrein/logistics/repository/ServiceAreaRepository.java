package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.ServiceArea;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceAreaRepository extends JpaRepository<ServiceArea, Long> {

    List<ServiceArea> findByActiveTrueOrderByNameAsc();

    boolean existsByNameIgnoreCaseAndActiveTrue(String name);

    boolean existsByNameIgnoreCaseAndActiveTrueAndIdNot(String name, Long id);
}
