package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.ServiceAreaRequest;
import com.paragrein.logistics.dto.ServiceAreaResponse;
import com.paragrein.logistics.service.ServiceAreaService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/service-areas")
public class AdminServiceAreaController {

    private final ServiceAreaService serviceAreaService;

    public AdminServiceAreaController(ServiceAreaService serviceAreaService) {
        this.serviceAreaService = serviceAreaService;
    }

    @GetMapping
    public List<ServiceAreaResponse> listAll() {
        return serviceAreaService.listAll();
    }

    @GetMapping("/active")
    public List<ServiceAreaResponse> listActive() {
        return serviceAreaService.listActive();
    }

    @GetMapping("/{id}")
    public ServiceAreaResponse getById(@PathVariable Long id) {
        return serviceAreaService.getById(id);
    }

    @PostMapping
    public ServiceAreaResponse create(@RequestBody ServiceAreaRequest request, Authentication authentication) {
        return serviceAreaService.create(request, authentication);
    }

    @PutMapping("/{id}")
    public ServiceAreaResponse update(@PathVariable Long id, @RequestBody ServiceAreaRequest request, Authentication authentication) {
        return serviceAreaService.update(id, request, authentication);
    }

    @PatchMapping("/{id}/activate")
    public ServiceAreaResponse activate(@PathVariable Long id, Authentication authentication) {
        return serviceAreaService.activate(id, authentication);
    }

    @PatchMapping("/{id}/deactivate")
    public ServiceAreaResponse deactivate(@PathVariable Long id, Authentication authentication) {
        return serviceAreaService.deactivate(id, authentication);
    }
}
