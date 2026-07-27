import { apiRequest } from './apiClient.js';

export function getActiveServiceSettings() {
  return apiRequest('/admin/service-settings/active');
}

export function updateActiveServiceSettings(payload) {
  return apiRequest('/admin/service-settings/active', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
