package com.paragrein.logistics.service;

import com.paragrein.logistics.dto.NotificationResponse;
import com.paragrein.logistics.dto.UnreadNotificationCountResponse;
import com.paragrein.logistics.entity.Notification;
import com.paragrein.logistics.entity.User;
import com.paragrein.logistics.enums.NotificationType;
import com.paragrein.logistics.enums.ReadStatus;
import com.paragrein.logistics.exception.AppException;
import com.paragrein.logistics.repository.NotificationRepository;
import com.paragrein.logistics.security.SecurityUserUtil;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(User user, String title, String message, NotificationType type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setNotificationType(type);
        notification.setReadStatus(ReadStatus.UNREAD);
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(NotificationResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getRecentNotificationsForUser(Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        return notificationRepository.findTop6ByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(NotificationResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public UnreadNotificationCountResponse getUnreadCount(Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        return new UnreadNotificationCountResponse(
                notificationRepository.countByUserIdAndReadStatus(user.getId(), ReadStatus.UNREAD)
        );
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId, Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException("Notification not found.", HttpStatus.NOT_FOUND));
        // Security note: notification state changes are limited to the notification owner.
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new AppException("You can only update your own notifications.", HttpStatus.FORBIDDEN);
        }
        notification.setReadStatus(ReadStatus.READ);
        return new NotificationResponse(notificationRepository.save(notification));
    }

    @Transactional
    public List<NotificationResponse> markAllAsRead(Authentication authentication) {
        User user = SecurityUserUtil.requireCurrentUser(authentication);
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        notifications.forEach(notification -> notification.setReadStatus(ReadStatus.READ));
        return notificationRepository.saveAll(notifications).stream()
                .map(NotificationResponse::new)
                .toList();
    }
}
