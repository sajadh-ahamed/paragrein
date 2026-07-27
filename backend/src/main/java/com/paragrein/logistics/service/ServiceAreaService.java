package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.ServiceAreaRequest;
import com.paragrein.logistics.dto.ServiceAreaResponse;
import com.paragrein.logistics.entity.AuditLog;
import com.paragrein.logistics.entity.ServiceArea;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.AuditLogRepository;
import com.paragrein.logistics.repository.ServiceAreaRepository;
import com.paragrein.logistics.security.SecurityUserUtil;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceAreaService {

    private final ServiceAreaRepository serviceAreaRepository;
    private final AuditLogRepository auditLogRepository;

    public ServiceAreaService(ServiceAreaRepository serviceAreaRepository, AuditLogRepository auditLogRepository) {
        this.serviceAreaRepository = serviceAreaRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(readOnly = true)
    public List<ServiceAreaResponse> listAll() {
        return serviceAreaRepository.findAll().stream()
                .map(ServiceAreaResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ServiceAreaResponse> listActive() {
        return serviceAreaRepository.findByActiveTrueOrderByNameAsc().stream()
                .map(ServiceAreaResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServiceAreaResponse getById(Long id) {
        return new ServiceAreaResponse(findById(id));
    }

    @Transactional
    public ServiceAreaResponse create(ServiceAreaRequest request, Authentication authentication) {
        validateRequest(request);

        if (serviceAreaRepository.existsByNameIgnoreCaseAndActiveTrue(clean(request.getName()))) {
            throw new AppException("An active service area with this name already exists.", HttpStatus.CONFLICT);
        }

        ServiceArea serviceArea = new ServiceArea();
        applyRequest(serviceArea, request);
        serviceArea.setActive(request.getActive() == null || request.getActive());
        ServiceArea saved = serviceAreaRepository.save(serviceArea);
        saveAudit(SecurityUserUtil.requireCurrentUser(authentication), "SERVICE_AREA_CREATED", "ServiceArea", saved.getId(), "Created service area: " + saved.getName());
        return new ServiceAreaResponse(saved);
    }

    @Transactional
    public ServiceAreaResponse update(Long id, ServiceAreaRequest request, Authentication authentication) {
        validateRequest(request);
        ServiceArea serviceArea = findById(id);

        boolean willBeActive = request.getActive() == null ? Boolean.TRUE.equals(serviceArea.getActive()) : request.getActive();
        if (willBeActive && serviceAreaRepository.existsByNameIgnoreCaseAndActiveTrueAndIdNot(clean(request.getName()), id)) {
            throw new AppException("An active service area with this name already exists.", HttpStatus.CONFLICT);
        }

        applyRequest(serviceArea, request);
        if (request.getActive() != null) {
            serviceArea.setActive(request.getActive());
        }

        ServiceArea saved = serviceAreaRepository.save(serviceArea);
        saveAudit(SecurityUserUtil.requireCurrentUser(authentication), "SERVICE_AREA_UPDATED", "ServiceArea", saved.getId(), "Updated service area: " + saved.getName());
        return new ServiceAreaResponse(saved);
    }

    @Transactional
    public ServiceAreaResponse activate(Long id, Authentication authentication) {
        ServiceArea serviceArea = findById(id);
        if (serviceAreaRepository.existsByNameIgnoreCaseAndActiveTrueAndIdNot(serviceArea.getName(), id)) {
            throw new AppException("Another active service area with this name already exists.", HttpStatus.CONFLICT);
        }
        serviceArea.setActive(true);
        ServiceArea saved = serviceAreaRepository.save(serviceArea);
        saveAudit(SecurityUserUtil.requireCurrentUser(authentication), "SERVICE_AREA_ACTIVATED", "ServiceArea", saved.getId(), "Activated service area: " + saved.getName());
        return new ServiceAreaResponse(saved);
    }

    @Transactional
    public ServiceAreaResponse deactivate(Long id, Authentication authentication) {
        ServiceArea serviceArea = findById(id);
        serviceArea.setActive(false);
        ServiceArea saved = serviceAreaRepository.save(serviceArea);
        saveAudit(SecurityUserUtil.requireCurrentUser(authentication), "SERVICE_AREA_DEACTIVATED", "ServiceArea", saved.getId(), "Deactivated service area: " + saved.getName());
        return new ServiceAreaResponse(saved);
    }

    public ServiceArea findById(Long id) {
        return serviceAreaRepository.findById(id)
                .orElseThrow(() -> new AppException("Service area not found.", HttpStatus.NOT_FOUND));
    }

    private void validateRequest(ServiceAreaRequest request) {
        if (request == null) {
            throw new AppException("Service area details are required.", HttpStatus.BAD_REQUEST);
        }
        if (isBlank(request.getName())) {
            throw new AppException("Service area name is required.", HttpStatus.BAD_REQUEST);
        }
        if (isBlank(request.getDistrict())) {
            throw new AppException("District is required.", HttpStatus.BAD_REQUEST);
        }
        if (request.getDistanceToHubKm() == null || request.getDistanceToHubKm().compareTo(BigDecimal.ZERO) < 0) {
            throw new AppException("Distance to hub must be greater than or equal to 0.", HttpStatus.BAD_REQUEST);
        }
    }

    private void applyRequest(ServiceArea serviceArea, ServiceAreaRequest request) {
        serviceArea.setName(clean(request.getName()));
        serviceArea.setDistrict(clean(request.getDistrict()));
        serviceArea.setDistanceToHubKm(request.getDistanceToHubKm());
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

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}
