import { apiRequest } from './apiClient.js';

export function getPickupDashboardSummary() {
  return apiRequest('/pickup/dashboard-summary');
}

export function getAssignedPickupTasks() {
  return apiRequest('/pickup/tasks');
}

export function getPickupHistory() {
  return apiRequest('/pickup/tasks/history');
}

export function getPickupTaskDetail(assignmentId) {
  return apiRequest(`/pickup/tasks/${assignmentId}`);
}

export function acceptPickupTask(assignmentId, note = '') {
  return apiRequest(`/pickup/tasks/${assignmentId}/accept`, {
    method: 'PATCH',
    body: JSON.stringify({ note }),
  });
}

export function markParcelPickedUp(assignmentId, note = '') {
  return apiRequest(`/pickup/tasks/${assignmentId}/mark-picked-up`, {
    method: 'PATCH',
    body: JSON.stringify({ note }),
  });
}

export function markReachedWarehouse(assignmentId, note = '') {
  return apiRequest(`/pickup/tasks/${assignmentId}/reach-warehouse`, {
    method: 'PATCH',
    body: JSON.stringify({ note }),
  });
}
