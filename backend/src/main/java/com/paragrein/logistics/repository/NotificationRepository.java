package com.paragrein.logistics.repository;

import com.paragrein.logistics.entity.Notification;
import com.paragrein.logistics.enums.ReadStatus;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @EntityGraph(attributePaths = {"user", "user.role"})
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = {"user", "user.role"})
    List<Notification> findTop6ByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndReadStatus(Long userId, ReadStatus readStatus);
}
