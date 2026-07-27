package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.AssignmentType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AssignmentResponse {

    private Long id;
    private Long orderId;
    private String trackingNumber;
    private AssignmentType assignmentType;
    private AssignmentStatus assignmentStatus;
    private Long assignedToUserId;
    private String assignedToName;
    private String assignedToUsername;
    private Long assignedByUserId;
    private String assignedByUsername;
    private LocalDateTime assignedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;

    public AssignmentResponse(Assignment assignment) {
        this.id = assignment.getId();
        this.orderId = assignment.getOrder().getId();
        this.trackingNumber = assignment.getOrder().getTrackingNumber();
        this.assignmentType = assignment.getAssignmentType();
        this.assignmentStatus = assignment.getAssignmentStatus();
        this.assignedToUserId = assignment.getAssignedToUser().getId();
        this.assignedToName = assignment.getAssignedToUser().getFullName();
        this.assignedToUsername = assignment.getAssignedToUser().getUsername();
        this.assignedByUserId = assignment.getAssignedByUser() == null ? null : assignment.getAssignedByUser().getId();
        this.assignedByUsername = assignment.getAssignedByUser() == null ? null : assignment.getAssignedByUser().getUsername();
        this.assignedAt = assignment.getAssignedAt();
        this.acceptedAt = assignment.getAcceptedAt();
        this.completedAt = assignment.getCompletedAt();
    }
}
