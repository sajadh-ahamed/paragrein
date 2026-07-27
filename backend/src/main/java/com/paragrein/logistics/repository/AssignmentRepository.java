package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.Assignment;
import com.paragrein.logistics.enums.AssignmentStatus;
import com.paragrein.logistics.enums.AssignmentType;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    boolean existsByOrderIdAndAssignmentTypeAndAssignmentStatusIn(
            Long orderId,
            AssignmentType assignmentType,
            Collection<AssignmentStatus> assignmentStatuses
    );

    boolean existsByOrderIdAndAssignmentTypeAndAssignmentStatus(
            Long orderId,
            AssignmentType assignmentType,
            AssignmentStatus assignmentStatus
    );

    @EntityGraph(attributePaths = {"order", "order.customer", "order.pickupArea", "order.dropoffArea", "assignedToUser", "assignedByUser"})
    List<Assignment> findByAssignmentTypeAndAssignmentStatusInOrderByAssignedAtDesc(
            AssignmentType assignmentType,
            Collection<AssignmentStatus> assignmentStatuses
    );

    @Override
    @EntityGraph(attributePaths = {"order", "order.customer", "order.pickupArea", "order.dropoffArea", "assignedToUser", "assignedByUser"})
    Optional<Assignment> findById(Long id);

    long countByAssignmentTypeAndAssignmentStatusIn(AssignmentType assignmentType, Collection<AssignmentStatus> assignmentStatuses);

    @EntityGraph(attributePaths = {"order", "order.customer", "order.pickupArea", "order.dropoffArea", "assignedToUser", "assignedByUser"})
    List<Assignment> findByAssignmentTypeAndAssignedToUserIdAndAssignmentStatusInOrderByAssignedAtDesc(
            AssignmentType assignmentType,
            Long assignedToUserId,
            Collection<AssignmentStatus> assignmentStatuses
    );

    @EntityGraph(attributePaths = {"order", "order.customer", "order.pickupArea", "order.dropoffArea", "assignedToUser", "assignedByUser"})
    List<Assignment> findByAssignmentTypeAndAssignedToUserIdOrderByAssignedAtDesc(AssignmentType assignmentType, Long assignedToUserId);

    @EntityGraph(attributePaths = {"order", "order.customer", "order.pickupArea", "order.dropoffArea", "assignedToUser", "assignedByUser"})
    Optional<Assignment> findByIdAndAssignedToUserId(Long id, Long assignedToUserId);

    @EntityGraph(attributePaths = {"order", "order.customer", "order.pickupArea", "order.dropoffArea", "assignedToUser", "assignedByUser"})
    Optional<Assignment> findFirstByOrderIdAndAssignmentTypeOrderByAssignedAtDesc(Long orderId, AssignmentType assignmentType);

    @EntityGraph(attributePaths = {"order", "order.customer", "order.pickupArea", "order.dropoffArea", "assignedToUser", "assignedByUser"})
    List<Assignment> findAllByOrderByAssignedAtDesc();

    @EntityGraph(attributePaths = {"order", "order.customer", "order.pickupArea", "order.dropoffArea", "assignedToUser", "assignedByUser"})
    List<Assignment> findByOrderIdOrderByAssignedAtDesc(Long orderId);

    long countByAssignmentTypeAndAssignedToUserIdAndAssignmentStatus(
            AssignmentType assignmentType,
            Long assignedToUserId,
            AssignmentStatus assignmentStatus
    );
}
