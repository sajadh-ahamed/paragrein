package com.paragrein.logistics.entity;

import com.paragrein.logistics.enums.AvailabilityStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "employee_profiles")
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeeProfile extends AuditableEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "employee_number", nullable = false, unique = true, length = 40)
    private String employeeNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false, length = 30)
    private AvailabilityStatus availabilityStatus;

    @Column(nullable = false, length = 100)
    private String designation;

    @Column(name = "joined_date", nullable = false)
    private LocalDate joinedDate;
}
