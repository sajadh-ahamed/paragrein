import { apiRequest } from './apiClient.js';

export function getAdminDashboardSummary() {
  return apiRequest('/admin/dashboard-summary');
}

export function getLatestAdminOrders() {
  return apiRequest('/admin/orders/latest');
}

export function getOrdersReadyForPickup() {
  return apiRequest('/admin/orders/ready-for-pickup');
}

export function getOrdersReadyForDriver() {
  return apiRequest('/admin/orders/ready-for-driver');
}

export function getAdminOrderDetail(orderId) {
  return apiRequest(`/admin/orders/${orderId}`);
}
