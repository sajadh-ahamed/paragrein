import { apiRequest } from './apiClient.js';

export function createIssueReport(payload) {
  return apiRequest('/issues', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMyIssues() {
  return apiRequest('/issues/my');
}

export function getAdminIssues() {
  return apiRequest('/admin/issues');
}

export function getAdminIssue(issueId) {
  return apiRequest(`/admin/issues/${issueId}`);
}

export function updateIssueStatus(issueId, issueStatus) {
  return apiRequest(`/admin/issues/${issueId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ issueStatus }),
  });
}

export function respondToIssue(issueId, adminResponse) {
  return apiRequest(`/admin/issues/${issueId}/respond`, {
    method: 'PATCH',
    body: JSON.stringify({ adminResponse }),
  });
}

export function closeIssue(issueId) {
  return apiRequest(`/admin/issues/${issueId}/close`, {
    method: 'PATCH',
  });
}
