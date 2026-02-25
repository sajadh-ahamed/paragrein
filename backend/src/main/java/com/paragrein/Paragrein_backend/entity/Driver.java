package com.paragrein.Paragrein_backend.entity;

import jakarta.persistence.*;

@Entity
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String licenseNumber;
    private String availabilityStatus;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Driver() {
    }

    public Driver(Long id, String licenseNumber, String availabilityStatus, User user) {
        this.id = id;
        this.licenseNumber = licenseNumber;
        this.availabilityStatus = availabilityStatus;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(String availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}