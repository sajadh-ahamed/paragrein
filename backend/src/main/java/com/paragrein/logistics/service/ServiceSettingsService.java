package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.ServiceSettingsRequest;
import com.paragrein.logistics.dto.ServiceSettingsResponse;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.ServiceSetting;
import com.paragrein.logistics.entity.SettingsHistory;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.ServiceSettingRepository;
import com.paragrein.logistics.repository.SettingsHistoryRepository;
import com.paragrein.logistics.security.SecurityUserUtil;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceSettingsService {

    private final ServiceSettingRepository serviceSettingRepository;
    private final SettingsHistoryRepository settingsHistoryRepository;
    private final AuditLogRepository auditLogRepository;

    public ServiceSettingsService(
            ServiceSettingRepository serviceSettingRepository,
            SettingsHistoryRepository settingsHistoryRepository,
            AuditLogRepository auditLogRepository
    ) {
        this.serviceSettingRepository = serviceSettingRepository;
        this.settingsHistoryRepository = settingsHistoryRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(readOnly = true)
    public ServiceSettingsResponse getActiveSettings() {
        return new ServiceSettingsResponse(findActiveSettings());
    }

    @Transactional
    public ServiceSettingsResponse updateActiveSettings(ServiceSettingsRequest request, Authentication authentication) {
        validateRequest(request);
        User currentUser = SecurityUserUtil.requireCurrentUser(authentication);
        ServiceSetting settings = findActiveSettings();

        recordChangeIfNeeded("base_rate", settings.getBaseRate(), request.getBaseRate(), currentUser);
        recordChangeIfNeeded("per_km_rate", settings.getPerKmRate(), request.getPerKmRate(), currentUser);
        recordChangeIfNeeded("advance_percentage", settings.getAdvancePercentage(), request.getAdvancePercentage(), currentUser);
//        recordChangeIfNeeded(
//                "per_kg_rate",
//                settings.getPerKgRate(),
//                request.getPerKgRate(),
//                currentUser);

        settings.setBaseRate(request.getBaseRate());
        settings.setPerKmRate(request.getPerKmRate());
//        settings.setPerKgRate(request.getPerKgRate());
        settings.setAdvancePercentage(request.getAdvancePercentage());

        ServiceSetting saved = serviceSettingRepository.save(settings);
        saveAudit(currentUser, "SERVICE_SETTINGS_UPDATED", "ServiceSetting", saved.getId(), "Updated active pricing settings.");
        return new ServiceSettingsResponse(saved);
    }

    public ServiceSetting findActiveSettings() {
        return serviceSettingRepository.findFirstByActiveTrueOrderByIdDesc()
                .orElseThrow(() -> new AppException("Active service settings are not configured.", HttpStatus.NOT_FOUND));
    }

    private void validateRequest(ServiceSettingsRequest request) {
        if (request == null) {
            throw new AppException("Service settings are required.", HttpStatus.BAD_REQUEST);
        }
        if (request.getBaseRate() == null || request.getBaseRate().compareTo(BigDecimal.ZERO) < 0) {
            throw new AppException("Base rate must be greater than or equal to 0.", HttpStatus.BAD_REQUEST);
        }
        if (request.getPerKmRate() == null || request.getPerKmRate().compareTo(BigDecimal.ZERO) < 0) {
            throw new AppException("Per KM rate must be greater than or equal to 0.", HttpStatus.BAD_REQUEST);
        }
        if (request.getAdvancePercentage() == null
                || request.getAdvancePercentage().compareTo(BigDecimal.ZERO) <= 0
                || request.getAdvancePercentage().compareTo(new BigDecimal("100")) > 0) {
            throw new AppException("Advance percentage must be greater than 0 and less than or equal to 100.", HttpStatus.BAD_REQUEST);
        }
//        if (request.getPerKgRate() == null
//                || request.getPerKgRate().compareTo(BigDecimal.ZERO) < 0) {
//            throw new AppException(
//                    "Per KG rate must be greater than or equal to 0.",
//                    HttpStatus.BAD_REQUEST);
//        }
    }

    private void recordChangeIfNeeded(String settingName, BigDecimal oldValue, BigDecimal newValue, User changedByUser) {
        if (oldValue.compareTo(newValue) == 0) {
            return;
        }

        SettingsHistory history = new SettingsHistory();
        history.setSettingName(settingName);
        history.setOldValue(oldValue.toPlainString());
        history.setNewValue(newValue.toPlainString());
        history.setChangedByUser(changedByUser);
        history.setChangedAt(LocalDateTime.now());
        settingsHistoryRepository.save(history);
    }

    private void saveAudit(User user, String action, String entityType, Long entityId, String description) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUser(user);
        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setDescription(description);
        auditLogRepository.save(auditLog);
    }
}
