//Handle all Service Area operations between React and Spring Boot
//React UI ↔ apiRequest ↔ Spring Boot ↔ Database

import { apiRequest } from './apiClient.js';


/*[
  { "id": 1, "name": "Colombo", "active": true },
  { "id": 2, "name": "Kandy", "active": false }
] */


/*[
  { "id": 1, "name": "Colombo", "active": true },
  { "id": 2, "name": "Kandy", "active": false }
] 
 Dropdown in your order form
 only shows usable locations
 Colombo
 Kandy
*/ 

// adds new location
export function createServiceArea(payload) {
  return apiRequest('/admin/service-areas', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

//edits existing area
export function updateServiceArea(id, payload) {
  return apiRequest(`/admin/service-areas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// ACTIVATE SERVICE AREA
export function activateServiceArea(id) {
  return apiRequest(`/admin/service-areas/${id}/activate`, {
    method: 'PATCH',
  });
}

// DEACTIVATE SERVICE AREA
export function deactivateServiceArea(id) {
  return apiRequest(`/admin/service-areas/${id}/deactivate`, {
    method: 'PATCH',
  });
}


//WHY PATCH HERE?

//  Because:

// ✔ we are only changing status
// ✔ not replacing full object