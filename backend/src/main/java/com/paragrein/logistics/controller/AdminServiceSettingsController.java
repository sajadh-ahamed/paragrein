package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.ServiceSettingsRequest;
import com.paragrein.logistics.dto.ServiceSettingsResponse;
import com.paragrein.logistics.service.ServiceSettingsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/service-settings")
public class AdminServiceSettingsController {

    private final ServiceSettingsService serviceSettingsService;

    public AdminServiceSettingsController(ServiceSettingsService serviceSettingsService) {
        this.serviceSettingsService = serviceSettingsService;
    }

    @GetMapping("/active")
    public ServiceSettingsResponse getActiveSettings() {
        return serviceSettingsService.getActiveSettings();
    }

    @PutMapping("/active")
    public ServiceSettingsResponse updateActiveSettings(@RequestBody ServiceSettingsRequest request, Authentication authentication) {
        return serviceSettingsService.updateActiveSettings(request, authentication);
    }
}
