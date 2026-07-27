package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.IssueReport;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueReportRepository extends JpaRepository<IssueReport, Long> {

    @Override
    @EntityGraph(attributePaths = {"reportedByUser", "reportedByUser.role", "resolvedByUser", "resolvedByUser.role"})
    List<IssueReport> findAll();

    @Override
    @EntityGraph(attributePaths = {"reportedByUser", "reportedByUser.role", "resolvedByUser", "resolvedByUser.role"})
    Optional<IssueReport> findById(Long id);

    @EntityGraph(attributePaths = {"reportedByUser", "reportedByUser.role", "resolvedByUser", "resolvedByUser.role"})
    List<IssueReport> findByReportedByUserIdOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = {"reportedByUser", "reportedByUser.role", "resolvedByUser", "resolvedByUser.role"})
    Optional<IssueReport> findByIdAndReportedByUserId(Long id, Long userId);
}
