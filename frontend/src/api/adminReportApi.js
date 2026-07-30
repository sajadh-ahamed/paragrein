import {
  apiRequest,
  apiDownload,
  buildQueryString,
} from './apiClient.js';

export function getAdminReportSummary(filters) {
  return apiRequest(`/admin/reports/summary${buildQueryString(filters)}`);
}

export function getDailyReport(date) {
  return apiRequest(`/admin/reports/daily${buildQueryString({ date })}`);
}

export function getMonthlyReport(year, month) {
  return apiRequest(`/admin/reports/monthly${buildQueryString({ year, month })}`);
}

export function getCompletedDeliveryReport(filters) {
  return apiRequest(
    `/admin/reports/completed-deliveries${buildQueryString(filters)}`,
  );
}

export function getWarehouseReport(filters) {
  return apiRequest(`/admin/reports/warehouse${buildQueryString(filters)}`);
}

export function getEmployeeWorkloadReport(filters) {
  return apiRequest(`/admin/reports/employee-workload${buildQueryString(filters)}`);
}

export function getRejectedOrderReport(filters) {
  return apiRequest(`/admin/reports/rejected-orders${buildQueryString(filters)}`);
}

export async function downloadAdminReportPdf(reportType, filters = {}) {
  const endpoints = {
    completed: '/admin/reports/completed-deliveries/export-pdf',
    warehouse: '/admin/reports/warehouse/export-pdf',
    workload: '/admin/reports/employee-workload/export-pdf',
    'financial-summary': '/admin/reports/financial-summary/export-pdf',
  };
  const endpoint = endpoints[reportType];
  if (!endpoint) {
    throw new Error('PDF export is not available for this report type yet.');
  }
  return apiDownload(
    `${endpoint}${buildQueryString(filters)}`,
    `${reportType}-report.pdf`,
  );
}
