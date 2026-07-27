import { apiRequest } from './apiClient.js';
import { getToken } from '../utils/authStorage.js';

const API_BASE_URL = 'http://localhost:8080/api';

function query(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  const text = params.toString();
  return text ? `?${text}` : '';
}

export function getRevenueReport(filters) {
  return apiRequest(`/finance/reports/revenue${query(filters)}`);
}

export function getOutstandingBalanceReport(filters) {
  return apiRequest(`/finance/reports/outstanding-balances${query(filters)}`);
}

export function getAdvancePaymentReport(filters) {
  return apiRequest(`/finance/reports/advance-payments${query(filters)}`);
}

export function getSettledOrderReport(filters) {
  return apiRequest(`/finance/reports/settled-orders${query(filters)}`);
}

export async function downloadFinanceReportCsv(reportType, filters = {}) {
  const endpoints = {
    revenue: '/finance/reports/revenue/export-csv',
    outstanding: '/finance/reports/outstanding-balances/export-csv',
  };
  const endpoint = endpoints[reportType];
  if (!endpoint) {
    throw new Error('CSV export is not available for this report type yet.');
  }
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}${query(filters)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error('CSV export failed. Please try again.');
  }
  const blob = await response.blob();
  const disposition = response.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="(.+)"/);
  return {
    blob,
    fileName: match?.[1] || 'finance-report.csv',
  };
}
