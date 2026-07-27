package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.ServiceSetting;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceSettingRepository extends JpaRepository<ServiceSetting, Long> {

    Optional<ServiceSetting> findFirstByActiveTrueOrderByIdDesc();
}
