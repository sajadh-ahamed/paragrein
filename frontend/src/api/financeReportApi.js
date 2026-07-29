import {
  apiRequest,
  apiDownload,
  buildQueryString,
} from './apiClient.js';

export function getRevenueReport(filters) {
  return apiRequest(`/finance/reports/revenue${buildQueryString(filters)}`);
}

export function getOutstandingBalanceReport(filters) {
  return apiRequest(
    `/finance/reports/outstanding-balances${buildQueryString(filters)}`,
  );
}

export function getAdvancePaymentReport(filters) {
  return apiRequest(`/finance/reports/advance-payments${buildQueryString(filters)}`);
}

export function getSettledOrderReport(filters) {
  return apiRequest(`/finance/reports/settled-orders${buildQueryString(filters)}`);
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
  return apiDownload(
    `${endpoint}${buildQueryString(filters)}`,
    `${reportType}-report.csv`,
  );
}
