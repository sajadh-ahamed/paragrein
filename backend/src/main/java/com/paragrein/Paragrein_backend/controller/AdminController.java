package com.paragrein.Paragrein_backend.controller;

import com.paragrein.Paragrein_backend.dto.ApiMessageResponse;
import com.paragrein.Paragrein_backend.dto.AdminUserResponse;
import com.paragrein.Paragrein_backend.dto.CreateWorkerRequest;
import com.paragrein.Paragrein_backend.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping({"/workers", "/create-worker"})
    public ResponseEntity<ApiMessageResponse> createWorker(@Valid @RequestBody CreateWorkerRequest request) {
        return ResponseEntity.ok(adminService.createWorker(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
}
