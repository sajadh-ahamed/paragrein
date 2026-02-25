package com.paragrein.Paragrein_backend.dto;

import java.util.Set;

public class AdminUserResponse {
    private Long id;
    private String username;
    private String email;
    private String nic;
    private String phone;
    private String status;
    private Set<String> roles;

    public AdminUserResponse() {
    }

    public AdminUserResponse(Long id, String username, String email, String nic, String phone, String status, Set<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.nic = nic;
        this.phone = phone;
        this.status = status;
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
