import { apiRequest } from './apiClient.js';

export function assignPickupAgent(orderId, pickupAgentUserId, note = '') {
  return apiRequest(`/admin/orders/${orderId}/assign-pickup`, {
    method: 'PATCH',
    body: JSON.stringify({ pickupAgentUserId, note }),
  });
}

export function assignDriver(orderId, driverUserId, note = '') {
  return apiRequest(`/admin/orders/${orderId}/assign-driver`, {
    method: 'PATCH',
    body: JSON.stringify({ driverUserId, note }),
  });
}

export function getAssignmentAvailablePickupAgents() {
  return apiRequest('/admin/assignments/available-pickup-agents');
}

export function getAssignmentAvailableDrivers() {
  return apiRequest('/admin/assignments/available-drivers');
}

export function getActivePickupAssignments() {
  return apiRequest('/admin/assignments/active-pickups');
}

export function getActiveDeliveryAssignments() {
  return apiRequest('/admin/assignments/active-deliveries');
}
