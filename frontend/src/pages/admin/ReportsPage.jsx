import { useEffect, useMemo, useState } from 'react';
import {
  downloadAdminReportCsv,
  getAdminReportSummary,
  getCompletedDeliveryReport,
  getDailyReport,
  getEmployeeWorkloadReport,
  getMonthlyReport,
  getRejectedOrderReport,
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
  { value: 'rejected', label: 'Rejected Orders' },
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
  const [summary, setSummary] = useState(null);
  const [dailyMonthly, setDailyMonthly] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
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
      setDailyMonthly(null);
      const range = { dateFrom: filters.dateFrom, dateTo: filters.dateTo };
      const summaryData = await getAdminReportSummary(range);
      setSummary(summaryData);

      if (reportType === 'daily') {
        setDailyMonthly(await getDailyReport(filters.date));
        setRows([]);
      } else if (reportType === 'monthly') {
        setDailyMonthly(await getMonthlyReport(filters.year, filters.month));
        setRows([]);
      } else if (reportType === 'completed') {
        setRows(await getCompletedDeliveryReport(range));
      } else if (reportType === 'warehouse') {
        setRows(await getWarehouseReport(range));
      } else if (reportType === 'workload') {
        setRows(await getEmployeeWorkloadReport({ role: filters.role }));
      } else if (reportType === 'rejected') {
        setRows(await getRejectedOrderReport(range));
      }
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  async function exportCsv() {
    try {
      setExporting(true);
      if (!validateFilters()) {
        return;
      }
      const range = { dateFrom: filters.dateFrom, dateTo: filters.dateTo, role: filters.role };
      const { blob, fileName } = await downloadAdminReportCsv(reportType, range);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setExporting(false);
    }
  }

  const columns = useMemo(() => {
    if (reportType === 'completed') {
      return [
        { key: 'trackingNumber', header: 'Tracking', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
        { key: 'customerName', header: 'Customer' },
        { key: 'receiverName', header: 'Receiver' },
        { key: 'driverName', header: 'Driver' },
        { key: 'deliveredAt', header: 'Delivered', render: (row) => formatDateTime(row.deliveredAt) },
        { key: 'totalAmount', header: 'Total', render: (row) => formatMoney(row.totalAmount) },
        { key: 'balanceCollected', header: 'Balance', render: (row) => formatMoney(row.balanceCollected) },
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
    return [
      { key: 'trackingNumber', header: 'Tracking', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
      { key: 'customerName', header: 'Customer' },
      { key: 'orderStatus', header: 'Order', render: (row) => <StatusBadge variant={statusVariant(row.orderStatus)}>{formatStatus(row.orderStatus)}</StatusBadge> },
      { key: 'financialStatus', header: 'Finance', render: (row) => <StatusBadge variant={statusVariant(row.financialStatus)}>{formatStatus(row.financialStatus)}</StatusBadge> },
      { key: 'rejectionReason', header: 'Reason', render: (row) => row.rejectionReason || '-' },
      { key: 'createdAt', header: 'Created', render: (row) => formatDateTime(row.createdAt) },
    ];
  }, [reportType]);

  const canExport = ['completed', 'warehouse', 'workload'].includes(reportType);

  function validateFilters() {
    if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
      setError('Date from must be before or equal to date to.');
      setLoading(false);
      setExporting(false);
      return false;
    }
    if (Number(filters.month) < 1 || Number(filters.month) > 12) {
      setError('Month must be between 1 and 12.');
      setLoading(false);
      setExporting(false);
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
        description="Generate local operational reports and export clear CSV files."
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

          {['completed', 'warehouse', 'rejected'].includes(reportType) && (
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
            <SecondaryButton onClick={exportCsv} disabled={!canExport || exporting}>
              {exporting ? 'Exporting...' : 'Export CSV'}
            </SecondaryButton>
          </div>
        </div>
        <p className="mt-3 text-xs text-[#94A3B8]">Daily summary uses the single date field. Monthly summary uses the current month by default. CSV export is available for completed delivery, warehouse, and workload reports.</p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Orders" value={loading ? '...' : summary?.totalOrders || 0} />
        <StatCard label="Delivered" value={loading ? '...' : summary?.deliveredOrders || 0} />
        <StatCard label="Warehouse" value={loading ? '...' : summary?.warehouseOrders || 0} tone="blue" />
        <StatCard label="Rejected/Cancelled" value={loading ? '...' : summary?.rejectedOrders || 0} tone="amber" />
      </section>

      {dailyMonthly && (
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Orders Created" value={dailyMonthly.ordersCreated} />
          <StatCard label="Orders Delivered" value={dailyMonthly.ordersDelivered} />
          <StatCard label="Revenue Collected" value={formatMoney(dailyMonthly.revenueCollected)} tone="blue" />
        </section>
      )}

      {!['daily', 'monthly'].includes(reportType) && (
        <section className="pg-panel mt-6 p-5">
          <DataTable columns={columns} data={rows || []} loading={loading} emptyMessage="No report data found." />
        </section>
      )}
    </DashboardLayout>
  );
}

export default ReportsPage;
