import { apiRequest } from './apiClient.js';

export function getWarehouseDashboardSummary() {
  return apiRequest('/warehouse/dashboard-summary');
}

export function getArrivalQueue() {
  return apiRequest('/warehouse/arrival-queue');
}

export function getProcessingOrders() {
  return apiRequest('/warehouse/processing');
}

export function getReadyForDispatchOrders() {
  return apiRequest('/warehouse/ready-for-dispatch');
}

export function getWarehouseHistory() {
  return apiRequest('/warehouse/history');
}

export function getWarehouseOrderDetail(orderId) {
  return apiRequest(`/warehouse/orders/${orderId}`);
}

export function confirmWarehouseArrival(orderId, payload) {
  return apiRequest(`/warehouse/orders/${orderId}/confirm-arrival`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function markWarehouseProcessing(orderId, payload) {
  return apiRequest(`/warehouse/orders/${orderId}/mark-processing`, {
    method: 'PATCH',
    body: JSON.stringify(payload || {}),
  });
}

export function markReadyForDispatch(orderId, note = '') {
  return apiRequest(`/warehouse/orders/${orderId}/ready-for-dispatch`, {
    method: 'PATCH',
    body: JSON.stringify({ note }),
  });
}
