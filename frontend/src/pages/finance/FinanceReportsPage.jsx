import { useEffect, useState } from 'react';
import {
  downloadFinanceReportCsv,
  getAdvancePaymentReport,
  getOutstandingBalanceReport,
  getRevenueReport,
  getSettledOrderReport,
} from '../../api/financeReportApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatMoney, formatStatus, statusVariant } from '../../utils/formatters.js';

function FinanceReportsPage() {
  const initialFilters = { dateFrom: '', dateTo: '' };
  const [filters, setFilters] = useState(initialFilters);
  const [revenue, setRevenue] = useState(null);
  const [outstanding, setOutstanding] = useState([]);
  const [advancePayments, setAdvancePayments] = useState([]);
  const [settledOrders, setSettledOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  async function loadReports() {
    try {
      setLoading(true);
      setError('');
      if (!validateFilters()) {
        return;
      }
      const [revenueData, outstandingData, advanceData, settledData] = await Promise.all([
        getRevenueReport(filters),
        getOutstandingBalanceReport(filters),
        getAdvancePaymentReport(filters),
        getSettledOrderReport(filters),
      ]);
      setRevenue(revenueData);
      setOutstanding(outstandingData || []);
      setAdvancePayments(advanceData || []);
      setSettledOrders(settledData || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  async function exportCsv(type) {
    try {
      setExporting(type);
      if (!validateFilters()) {
        return;
      }
      const { blob, fileName } = await downloadFinanceReportCsv(type, filters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setExporting('');
    }
  }

  const outstandingColumns = [
    { key: 'trackingNumber', header: 'Tracking', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'totalAmount', header: 'Total', render: (row) => formatMoney(row.totalAmount) },
    { key: 'advanceAmount', header: 'Advance', render: (row) => formatMoney(row.advanceAmount) },
    { key: 'balanceAmount', header: 'Balance', render: (row) => <span className="font-bold text-[#FCD34D]">{formatMoney(row.balanceAmount)}</span> },
    { key: 'financialStatus', header: 'Finance', render: (row) => <StatusBadge variant={statusVariant(row.financialStatus)}>{formatStatus(row.financialStatus)}</StatusBadge> },
    { key: 'orderStatus', header: 'Order', render: (row) => <StatusBadge variant={statusVariant(row.orderStatus)}>{formatStatus(row.orderStatus)}</StatusBadge> },
  ];

  const paymentColumns = [
    { key: 'trackingNumber', header: 'Tracking', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'reference', header: 'Reference', render: (row) => row.reference || '-' },
    { key: 'amount', header: 'Amount', render: (row) => formatMoney(row.amount) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge variant={statusVariant(row.status)}>{formatStatus(row.status)}</StatusBadge> },
    { key: 'createdAt', header: 'Created', render: (row) => formatDateTime(row.createdAt) },
    { key: 'completedAt', header: 'Completed', render: (row) => formatDateTime(row.completedAt) },
  ];

  function validateFilters() {
    if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
      setError('Date from must be before or equal to date to.');
      setLoading(false);
      setExporting('');
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
        eyebrow="Finance Reports"
        title="Revenue and Settlement Reports"
        description="Review local revenue, advance payments, outstanding balances, and fully settled orders."
      />
      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="pg-panel mt-6 p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto_auto_auto]">
          <label className="block">
            <span className="pg-label">Date From</span>
            <input type="date" name="dateFrom" value={filters.dateFrom} onChange={updateFilter} className="pg-field mt-2" />
          </label>
          <label className="block">
            <span className="pg-label">Date To</span>
            <input type="date" name="dateTo" value={filters.dateTo} onChange={updateFilter} className="pg-field mt-2" />
          </label>
          <PrimaryButton onClick={loadReports}>Generate</PrimaryButton>
          <SecondaryButton onClick={resetFilters}>Reset</SecondaryButton>
          <SecondaryButton onClick={() => exportCsv('revenue')} disabled={exporting === 'revenue'}>{exporting === 'revenue' ? 'Exporting...' : 'Export Revenue CSV'}</SecondaryButton>
          <SecondaryButton onClick={() => exportCsv('outstanding')} disabled={exporting === 'outstanding'}>{exporting === 'outstanding' ? 'Exporting...' : 'Export Outstanding CSV'}</SecondaryButton>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Advance Received" value={loading ? '...' : formatMoney(revenue?.totalAdvanceReceived)} />
        <StatCard label="Balance Collected" value={loading ? '...' : formatMoney(revenue?.totalBalanceCollected)} />
        <StatCard label="Total Revenue" value={loading ? '...' : formatMoney(revenue?.totalRevenue)} tone="blue" />
        <StatCard label="Outstanding Balance" value={loading ? '...' : formatMoney(revenue?.outstandingBalanceTotal)} tone="amber" />
        <StatCard label="Verified Advances" value={loading ? '...' : revenue?.verifiedAdvanceCount || 0} />
        <StatCard label="Fully Settled" value={loading ? '...' : revenue?.fullySettledCount || 0} />
      </section>

      <section className="mt-6 grid gap-6">
        <div className="pg-panel p-5">
          <h2 className="mb-4 text-xl font-bold">Outstanding Balances</h2>
          <DataTable columns={outstandingColumns} data={outstanding} loading={loading} emptyMessage="No outstanding balances found." />
        </div>

        <div className="pg-panel p-5">
          <h2 className="mb-4 text-xl font-bold">Advance Payments</h2>
          <DataTable columns={paymentColumns} data={advancePayments} loading={loading} emptyMessage="No advance payments found." />
        </div>

        <div className="pg-panel p-5">
          <h2 className="mb-4 text-xl font-bold">Settled Orders</h2>
          <DataTable columns={paymentColumns} data={settledOrders} loading={loading} emptyMessage="No settled orders found." />
        </div>
      </section>
    </DashboardLayout>
  );
}

export default FinanceReportsPage;
