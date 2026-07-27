package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.EmployeeDetailResponse;
import com.paragrein.logistics.dto.EmployeeRequest;
import com.paragrein.logistics.dto.EmployeeResponse;
import com.paragrein.logistics.dto.EmployeeAvailabilityResponse;
import com.paragrein.logistics.enums.AccountStatus;
import com.paragrein.logistics.enums.AvailabilityStatus;
import com.paragrein.logistics.enums.RoleCode;
import com.paragrein.logistics.service.EmployeeManagementService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/admin/employees")
public class AdminEmployeeController {

    private final EmployeeManagementService employeeManagementService;

    public AdminEmployeeController(EmployeeManagementService employeeManagementService) {
        this.employeeManagementService = employeeManagementService;
    }

    @GetMapping
    public List<EmployeeResponse> listEmployees(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) RoleCode roleCode,
            @RequestParam(required = false) AccountStatus accountStatus,
            @RequestParam(required = false) AvailabilityStatus availabilityStatus) {
        if (query == null && roleCode == null && accountStatus == null && availabilityStatus == null) {
            return employeeManagementService.listEmployees();
        }
        return employeeManagementService.searchEmployees(query, roleCode, accountStatus, availabilityStatus);
    }

    @GetMapping("/{id}")
    public EmployeeDetailResponse getEmployeeDetail(@PathVariable Long id) {
        return employeeManagementService.getEmployeeDetail(id);
    }

    @PostMapping
    public EmployeeDetailResponse createEmployee(@RequestBody EmployeeRequest request, Authentication authentication) {
        return employeeManagementService.createEmployee(request, authentication);
    }

    @PutMapping("/{id}")
    public EmployeeDetailResponse updateEmployee(@PathVariable Long id, @RequestBody EmployeeRequest request,
            Authentication authentication) {
        return employeeManagementService.updateEmployee(id, request, authentication);
    }

    @PatchMapping("/{id}/activate")
    public EmployeeDetailResponse activateEmployee(@PathVariable Long id, Authentication authentication) {
        return employeeManagementService.activateEmployee(id, authentication);
    }

    @PatchMapping("/{id}/deactivate")
    public EmployeeDetailResponse deactivateEmployee(@PathVariable Long id, Authentication authentication) {
        return employeeManagementService.deactivateEmployee(id, authentication);
    }

    @GetMapping("/available-pickup-agents")
    public List<EmployeeAvailabilityResponse> listAvailablePickupAgents() {
        return employeeManagementService.listAvailablePickupAgents();
    }

    @GetMapping("/available-drivers")
    public List<EmployeeAvailabilityResponse> listAvailableDrivers() {
        return employeeManagementService.listAvailableDrivers();
    }

    //delete emplyee in action in admin dashbaod emplyess side bar
    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable Long id, Authentication authentication) {
        employeeManagementService.deleteEmployee(id, authentication);
    }
}
