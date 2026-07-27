import { apiRequest } from './apiClient.js';

export function getNotifications() {
  return apiRequest('/notifications');
}

export function getRecentNotifications() {
  return apiRequest('/notifications/recent');
}

export function getUnreadNotificationCount() {
  return apiRequest('/notifications/unread-count');
}

export function markNotificationAsRead(notificationId) {
  return apiRequest(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
}

export function markAllNotificationsAsRead() {
  return apiRequest('/notifications/mark-all-read', {
    method: 'PATCH',
  });
}
