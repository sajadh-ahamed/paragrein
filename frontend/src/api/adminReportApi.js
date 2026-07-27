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

export function getAdminReportSummary(filters) {
  return apiRequest(`/admin/reports/summary${query(filters)}`);
}

export function getDailyReport(date) {
  return apiRequest(`/admin/reports/daily${query({ date })}`);
}

export function getMonthlyReport(year, month) {
  return apiRequest(`/admin/reports/monthly${query({ year, month })}`);
}

export function getCompletedDeliveryReport(filters) {
  return apiRequest(`/admin/reports/completed-deliveries${query(filters)}`);
}

export function getWarehouseReport(filters) {
  return apiRequest(`/admin/reports/warehouse${query(filters)}`);
}

export function getEmployeeWorkloadReport(filters) {
  return apiRequest(`/admin/reports/employee-workload${query(filters)}`);
}

export function getRejectedOrderReport(filters) {
  return apiRequest(`/admin/reports/rejected-orders${query(filters)}`);
}

export async function downloadAdminReportCsv(reportType, filters = {}) {
  const endpoints = {
    completed: '/admin/reports/completed-deliveries/export-csv',
    warehouse: '/admin/reports/warehouse/export-csv',
    workload: '/admin/reports/employee-workload/export-csv',
  };
  const endpoint = endpoints[reportType];
  if (!endpoint) {
    throw new Error('CSV export is not available for this report type yet.');
  }
  return downloadCsv(`${API_BASE_URL}${endpoint}${query(filters)}`);
}

async function downloadCsv(url) {
  const token = getToken();
  const response = await fetch(url, {
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
    fileName: match?.[1] || 'report.csv',
  };
}
