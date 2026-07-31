import { useEffect, useMemo, useState } from 'react';
import {
  downloadAdminReportPdf,
  getCompletedDeliveryReport,
  getDailyReport,
  getEmployeeWorkloadReport,
  getFinancialSummaryReport,
  getMonthlyReport,
  getWarehouseReport,
} from '../../api/adminReportApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatMoney, formatStatus, statusVariant } from '../../utils/formatters.js';

const reportTypes = [
  { value: 'daily', label: 'Daily Summary' },
  { value: 'monthly', label: 'Monthly Summary' },
  { value: 'completed', label: 'Completed Deliveries' },
  { value: 'warehouse', label: 'Warehouse Report' },
  { value: 'workload', label: 'Employee Workload' },
  { value: 'financial-summary', label: 'Financial Summary' },
];

const today = new Date().toISOString().slice(0, 10);
const initialFilters = {
  dateFrom: '',
  dateTo: '',
  date: today,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  role: '',
};

function ReportsPage() {
  const [reportType, setReportType] = useState('completed');
  const [filters, setFilters] = useState(initialFilters);
  const [rows, setRows] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false); // Renaming for clarity
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, [reportType]);

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }
  async function loadReport() {
    try {
      setLoading(true);
      setError('');
      if (!validateFilters()) {
        return;
      }
      setReportData(null);
      setRows([]);

      if (reportType === 'daily') {
        const dailyData = await getDailyReport(filters.date);
        setReportData(dailyData);
      } else if (reportType === 'monthly') {
        const monthlyData = await getMonthlyReport(filters.year, filters.month);
        setReportData(monthlyData);
      } else if (reportType === 'completed') {
        setRows(await getCompletedDeliveryReport({ dateFrom: filters.dateFrom, dateTo: filters.dateTo }));
      } else if (reportType === 'warehouse') {
        setRows(await getWarehouseReport({ dateFrom: filters.dateFrom, dateTo: filters.dateTo }));
      } else if (reportType === 'workload') {
        setRows(await getEmployeeWorkloadReport({ role: filters.role }));
      } else if (reportType === 'financial-summary') {
        const financialData = await getFinancialSummaryReport({
          dateFrom: filters.dateFrom || null, dateTo: filters.dateTo || null,
        });
        setReportData(financialData);
      }
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  async function exportPdf() {
    try {
      setIsExporting(true);
      if (!validateFilters()) {
        return;
      }

      const range = {
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        role: filters.role,
        date: filters.date,
        year: filters.year,
        month: filters.month,
      };

      const { blob, fileName } = await downloadAdminReportPdf(reportType, range); // Use new PDF function
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsExporting(false);
    }
  }

  const columns = useMemo(() => {
    if (reportType === 'completed') {
      return [
        { key: 'trackingNumber', header: 'Tracking', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
        { key: 'customerName', header: 'Customer' },
        { key: 'driverName', header: 'Driver' },
        { key: 'financialStatus', header: 'Finance', render: (row) => <StatusBadge variant={statusVariant(row.financialStatus)}>{formatStatus(row.financialStatus)}</StatusBadge> },
      ];
    }
    if (reportType === 'warehouse') {
      return [
        { key: 'trackingNumber', header: 'Tracking', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
        { key: 'parcelDescription', header: 'Parcel' },
        { key: 'parcelCondition', header: 'Condition' },
        { key: 'storageZone', header: 'Zone' },
        { key: 'storageRack', header: 'Rack' },
        { key: 'receivedAt', header: 'Received', render: (row) => formatDateTime(row.receivedAt) },
        { key: 'readyForDispatchAt', header: 'Ready', render: (row) => formatDateTime(row.readyForDispatchAt) },
        { key: 'orderStatus', header: 'Status', render: (row) => <StatusBadge variant={statusVariant(row.orderStatus)}>{formatStatus(row.orderStatus)}</StatusBadge> },
      ];
    }
    if (reportType === 'workload') {
      return [
        { key: 'employeeName', header: 'Employee', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.employeeName}</span> },
        { key: 'role', header: 'Role', render: (row) => formatStatus(row.role) },
        { key: 'employeeNumber', header: 'Employee No.' },
        { key: 'assignedCount', header: 'Assigned' },
        { key: 'acceptedCount', header: 'Accepted' },
        { key: 'completedCount', header: 'Completed' },
        { key: 'currentAvailability', header: 'Availability', render: (row) => <StatusBadge variant={statusVariant(row.currentAvailability)}>{formatStatus(row.currentAvailability)}</StatusBadge> },
      ];
    }
    if (['daily', 'monthly', 'financial-summary'].includes(reportType)) {
      return [
        { key: 'metric', header: 'Metric', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.metric}</span> },
        { key: 'value', header: 'Value', render: (row) => (row.isCurrency ? formatMoney(row.value) : row.value) },
      ];
    }

    return []; // Default empty for summary reports
  }, [reportType]);

  const canExport = ['completed', 'workload', 'financial-summary', 'daily', 'monthly'].includes(reportType);

  function validateFilters() {
    if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
      setError('Date from must be before or equal to date to.');
      setLoading(false);
      setIsExporting(false);
      return false;
    }
    if (Number(filters.month) < 1 || Number(filters.month) > 12) {
      setError('Month must be between 1 and 12.');
      setLoading(false);
      setIsExporting(false);
      return false;
    }
    return true;
  }

  function resetFilters() {
    setFilters(initialFilters);
    setError('');
  }

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin Reports"
        title="Operational Reports"
        description="Generate local operational reports and export professional PDF files." // Updated description
      />
      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="pg-panel mt-6 p-5">
        <div className="flex flex-wrap items-end gap-4">
          <label className="block">
            <span className="pg-label">Report Type</span>
            <select value={reportType} onChange={(event) => setReportType(event.target.value)} className="pg-field mt-2">
              {reportTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </label>

          {['completed', 'warehouse', 'financial-summary'].includes(reportType) && (
            <>
              <label className="block">
                <span className="pg-label">Date From</span>
                <input type="date" name="dateFrom" value={filters.dateFrom} onChange={updateFilter} className="pg-field mt-2" />
              </label>
              <label className="block">
                <span className="pg-label">Date To</span>
                <input type="date" name="dateTo" value={filters.dateTo} onChange={updateFilter} className="pg-field mt-2" />
              </label>
            </>
          )}

          {reportType === 'daily' && (
            <label className="block">
              <span className="pg-label">Daily Date</span>
              <input type="date" name="date" value={filters.date} onChange={updateFilter} className="pg-field mt-2" />
            </label>
          )}

          {reportType === 'monthly' && (
            <>
              <label className="block">
                <span className="pg-label">Year</span>
                <input type="number" name="year" value={filters.year} onChange={updateFilter} className="pg-field mt-2" />
              </label>
              <label className="block">
                <span className="pg-label">Month</span>
                <select name="month" value={filters.month} onChange={updateFilter} className="pg-field mt-2">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>)}
                </select>
              </label>
            </>
          )}

          {reportType === 'workload' && (
            <label className="block">
              <span className="pg-label">Employee Role</span>
              <select name="role" value={filters.role} onChange={updateFilter} className="pg-field mt-2">
                <option value="">All roles</option>
                <option value="PICKUP_AGENT">Pickup Agent</option>
                <option value="WAREHOUSE_STAFF">Warehouse Staff</option>
                <option value="DRIVER">Driver</option>
                <option value="FINANCE_OFFICER">Finance Officer</option>
              </select>
            </label>
          )}

          <div className="flex-grow" />

          <div className="flex gap-3">
            <PrimaryButton onClick={loadReport}>Generate</PrimaryButton>
            <SecondaryButton onClick={resetFilters}>Reset</SecondaryButton>
            <SecondaryButton onClick={exportPdf} disabled={!canExport || isExporting}>
              {isExporting ? 'Exporting...' : 'Download PDF'}
            </SecondaryButton>
          </div>
        </div>
        <p className="mt-3 text-xs text-[#94A3B8]">Daily summary uses the single date field. Monthly summary uses the current month by default. PDF export is available for all reports except Warehouse.</p>
      </section>

      {['completed', 'warehouse', 'workload', 'daily', 'monthly', 'financial-summary'].includes(reportType) && (
        <section className="pg-panel mt-6 p-5">
          <DataTable
            columns={columns}
            data={
              (() => {
                if ((reportType === 'daily' || reportType === 'monthly') && reportData?.summary) {
                  return [
                    { key: 'rejected', metric: 'Rejected/Cancelled', value: reportData.summary.rejectedOrders, isCurrency: false },
                    { key: 'warehouse', metric: 'Orders at Warehouse', value: reportData.summary.warehouseOrders, isCurrency: false },
                    { key: 'created', metric: 'Orders Created', value: reportData.ordersCreated, isCurrency: false },
                    { key: 'delivered', metric: 'Orders Delivered', value: reportData.ordersDelivered, isCurrency: false },
                    { key: 'revenue', metric: 'Revenue Collected', value: reportData.revenueCollected, isCurrency: true },
                  ];
                }
                if (reportType === 'financial-summary' && reportData) {
                  return [
                    { key: 'total', metric: 'Total Revenue', value: reportData.totalRevenue, isCurrency: true },
                    { key: 'advance', metric: 'Total Advance Received', value: reportData.totalAdvance, isCurrency: true },
                    { key: 'balance', metric: 'Total Balance Collected', value: reportData.totalBalance, isCurrency: true },           
                    { key: 'balanceToCollect', metric: 'Total Balance to Collect', value: reportData.totalBalanceToCollect, isCurrency: true },
                  ];
                }
                return ['daily', 'monthly', 'financial-summary'].includes(reportType) ? [] : rows || [];
              })()}
            loading={loading} emptyMessage="No report data found." />
        </section>
      )}
    </DashboardLayout>
  );
}

export default ReportsPage;
