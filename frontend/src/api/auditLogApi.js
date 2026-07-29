import { apiRequest, buildQueryString } from './apiClient.js';

export function getAuditLogs(filters = {}) {
  return apiRequest(`/admin/audit-logs${buildQueryString(filters)}`);
}

export function getRecentAuditLogs() {
  return apiRequest('/admin/audit-logs/recent');
}
