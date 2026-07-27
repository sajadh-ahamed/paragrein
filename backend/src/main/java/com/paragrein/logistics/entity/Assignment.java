package com.paragrein.logistics.entity;

import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.AssignmentType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "assignments")
@Data
@EqualsAndHashCode(callSuper = true)
public class Assignment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_type", nullable = false, length = 30)
    private AssignmentType assignmentType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assigned_to_user_id", nullable = false)
    private User assignedToUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_user_id")
    private User assignedByUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_status", nullable = false, length = 30)
    private AssignmentStatus assignmentStatus;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
