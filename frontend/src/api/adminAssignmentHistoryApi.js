import { apiRequest } from './apiClient.js';

export function getAssignmentHistory() {
  return apiRequest('/admin/assignments');
}

export function getAssignmentHistoryForOrder(orderId) {
  return apiRequest(`/admin/assignments/order/${orderId}`);
}
