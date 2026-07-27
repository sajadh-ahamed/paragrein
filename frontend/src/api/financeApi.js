import { apiRequest } from './apiClient.js';

export function getFinanceDashboardSummary() {
  return apiRequest('/finance/dashboard-summary');
}

export function getPendingAdvancePayments() {
  return apiRequest('/finance/payments/pending-advance');
}

export function getVerifiedAdvancePayments() {
  return apiRequest('/finance/payments/verified-advance');
}

export function getRejectedAdvancePayments() {
  return apiRequest('/finance/payments/rejected-advance');
}

export function getOutstandingBalances() {
  return apiRequest('/finance/payments/outstanding-balances');
}

export function getFinancePaymentDetail(paymentId) {
  return apiRequest(`/finance/payments/${paymentId}`);
}

export function verifyAdvancePayment(paymentId, note = '') {
  return apiRequest(`/finance/payments/${paymentId}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ note }),
  });
}

export function rejectAdvancePayment(paymentId, rejectionReason) {
  return apiRequest(`/finance/payments/${paymentId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ rejectionReason }),
  });
}
