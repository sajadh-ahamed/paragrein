package com.paragrein.logistics.controller;

import com.paragrein.logistics.dto.NotificationResponse;
import com.paragrein.logistics.dto.UnreadNotificationCountResponse;
import com.paragrein.logistics.service.NotificationService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getMyNotifications(Authentication authentication) {
        return notificationService.getMyNotifications(authentication);
    }

    @GetMapping("/recent")
    public List<NotificationResponse> getRecentNotifications(Authentication authentication) {
        return notificationService.getRecentNotificationsForUser(authentication);
    }

    @GetMapping("/unread-count")
    public UnreadNotificationCountResponse getUnreadCount(Authentication authentication) {
        return notificationService.getUnreadCount(authentication);
    }

    @PatchMapping("/{notificationId}/read")
    public NotificationResponse markAsRead(@PathVariable Long notificationId, Authentication authentication) {
        return notificationService.markAsRead(notificationId, authentication);
    }

    @PatchMapping("/mark-all-read")
    public List<NotificationResponse> markAllAsRead(Authentication authentication) {
        return notificationService.markAllAsRead(authentication);
    }
}
