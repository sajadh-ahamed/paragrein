import { apiRequest } from './apiClient.js';

export function getDriverDashboardSummary() {
  return apiRequest('/driver/dashboard-summary');
}

export function getAssignedDeliveries() {
  return apiRequest('/driver/deliveries');
}

export function getDeliveryHistory() {
  return apiRequest('/driver/deliveries/history');
}

export function getDeliveryTaskDetail(assignmentId) {
  return apiRequest(`/driver/deliveries/${assignmentId}`);
}

export function acceptDelivery(assignmentId, note = '') {
  return apiRequest(`/driver/deliveries/${assignmentId}/accept`, {
    method: 'PATCH',
    body: JSON.stringify({ note }),
  });
}

export function markReachedDestination(assignmentId, note = '') {
  return apiRequest(`/driver/deliveries/${assignmentId}/reach-destination`, {
    method: 'PATCH',
    body: JSON.stringify({ note }),
  });
}

export function completeDelivery(assignmentId, payload) {
  return apiRequest(`/driver/deliveries/${assignmentId}/complete`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
