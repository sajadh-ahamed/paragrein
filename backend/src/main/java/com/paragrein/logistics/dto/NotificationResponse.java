package com.paragrein.logistics.dto;

import com.paragrein.logistics.entity.Notification;
import com.paragrein.logistics.enums.NotificationType;
import com.paragrein.logistics.enums.ReadStatus;
import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private String title;
    private String message;
    private NotificationType notificationType;
    private ReadStatus readStatus;
    private LocalDateTime createdAt;

    public NotificationResponse(Notification notification) {
        this.id = notification.getId();
        this.title = notification.getTitle();
        this.message = notification.getMessage();
        this.notificationType = notification.getNotificationType();
        this.readStatus = notification.getReadStatus();
        this.createdAt = notification.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public ReadStatus getReadStatus() {
        return readStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
