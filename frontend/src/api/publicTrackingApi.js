import { apiRequest } from './apiClient.js';

export function trackOrderPublic(trackingNumber) {
  return apiRequest(`/public/track/${encodeURIComponent(trackingNumber)}`);
}
