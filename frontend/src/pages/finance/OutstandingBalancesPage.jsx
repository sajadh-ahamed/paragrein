import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOutstandingBalances } from '../../api/financeApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatMoney, formatStatus, statusVariant } from '../../utils/formatters.js';

function OutstandingBalancesPage() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalances();
  }, []);

  async function loadBalances() {
    try {
      setLoading(true);
      const data = await getOutstandingBalances();
      setPayments(data || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: 'trackingNumber', header: 'Tracking', render: (payment) => <span className="font-bold text-[#F8FAFC]">{payment.trackingNumber}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'totalAmount', header: 'Total', render: (payment) => formatMoney(payment.totalAmount) },
    { key: 'advanceAmount', header: 'Advance Verified', render: (payment) => <span className="font-bold text-[#86EFAC]">{formatMoney(payment.advanceAmount)}</span> },
    { key: 'balanceAmount', header: 'Outstanding Balance', render: (payment) => <span className="font-bold text-[#FCD34D]">{formatMoney(payment.balanceAmount)}</span> },
    { key: 'financialStatus', header: 'Financial Status', render: (payment) => <StatusBadge variant={statusVariant(payment.financialStatus)}>{formatStatus(payment.financialStatus)}</StatusBadge> },
    {
      key: 'actions',
      header: 'Action',
      render: (payment) => payment.paymentId ? (
        <Link to={`/finance/payments/${payment.paymentId}`}>
          <SecondaryButton className="px-3 py-1.5 text-xs">View Detail</SecondaryButton>
        </Link>
      ) : (
        <span className="text-xs text-[#94A3B8]">Payment record unavailable</span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Finance"
        title="Outstanding Balances"
        description="Orders with verified advances and a remaining balance due at final delivery."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={payments} loading={loading} emptyMessage="No outstanding balances found." />
      </section>
    </DashboardLayout>
  );
}

export default OutstandingBalancesPage;
