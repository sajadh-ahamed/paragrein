import { apiRequest } from './apiClient.js';

export function getAuditLogs(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  const query = params.toString();
  return apiRequest(`/admin/audit-logs${query ? `?${query}` : ''}`);
}

export function getRecentAuditLogs() {
  return apiRequest('/admin/audit-logs/recent');
}
