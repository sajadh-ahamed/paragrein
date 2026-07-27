package com.paragrein.logistics.dto;

public class UnreadNotificationCountResponse {

    private long unreadCount;

    public UnreadNotificationCountResponse(long unreadCount) {
        this.unreadCount = unreadCount;
    }

    public long getUnreadCount() {
        return unreadCount;
    }
}
