import { apiRequest } from './apiClient.js';

export function getEmployees(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  const query = params.toString();
  return apiRequest(`/admin/employees${query ? `?${query}` : ''}`);
}

export function getEmployeeDetail(userId) {
  return apiRequest(`/admin/employees/${userId}`);
}

export function createEmployee(payload) {
  return apiRequest('/admin/employees', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateEmployee(userId, payload) {
  return apiRequest(`/admin/employees/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function activateEmployee(userId) {
  return apiRequest(`/admin/employees/${userId}/activate`, { method: 'PATCH' });
}

export function deactivateEmployee(userId) {
  return apiRequest(`/admin/employees/${userId}/deactivate`, { method: 'PATCH' });
}

export function getAvailablePickupAgents() {
  return apiRequest('/admin/employees/available-pickup-agents');
}

export function getAvailableDrivers() {
  return apiRequest('/admin/employees/available-drivers');
}

//delete employee

// export function deleteEmployee(userId) {
//   return apiRequest(`/admin/employees/${userId}`, {
//     method: 'DELETE',
//   });
// }
