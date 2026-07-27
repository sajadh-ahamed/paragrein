import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRejectedAdvancePayments, getVerifiedAdvancePayments } from '../../api/financeApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatMoney, formatStatus, statusVariant } from '../../utils/formatters.js';

function PaymentHistoryPage() {
  const [activeTab, setActiveTab] = useState('verified');
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments(activeTab);
  }, [activeTab]);

  async function loadPayments(tab) {
    try {
      setLoading(true);
      const data = tab === 'verified' ? await getVerifiedAdvancePayments() : await getRejectedAdvancePayments();
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
    { key: 'paymentReference', header: 'Reference' },
    { key: 'advanceAmount', header: 'Advance', render: (payment) => <span className="font-bold text-[#86EFAC]">{formatMoney(payment.advanceAmount)}</span> },
    { key: 'paymentStatus', header: 'Status', render: (payment) => <StatusBadge variant={statusVariant(payment.paymentStatus)}>{formatStatus(payment.paymentStatus)}</StatusBadge> },
    { key: 'verifiedAt', header: 'Processed At', render: (payment) => formatDateTime(payment.verifiedAt) },
    { key: 'actions', header: 'Action', render: (payment) => <Link to={`/finance/payments/${payment.paymentId}`}><SecondaryButton className="px-3 py-1.5 text-xs">View Detail</SecondaryButton></Link> },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Finance"
        title="Payment History"
        description="Review verified and rejected advance payment decisions."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="pg-panel mt-6 p-5">
        <div className="mb-4 flex gap-2">
          <button type="button" onClick={() => setActiveTab('verified')} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === 'verified' ? 'bg-[#22C55E] text-[#07110B]' : 'border border-[#263247] bg-[#111827] text-[#CBD5E1]'}`}>
            Verified Advance
          </button>
          <button type="button" onClick={() => setActiveTab('rejected')} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === 'rejected' ? 'bg-[#22C55E] text-[#07110B]' : 'border border-[#263247] bg-[#111827] text-[#CBD5E1]'}`}>
            Rejected Advance
          </button>
        </div>
        <DataTable columns={columns} data={payments} loading={loading} emptyMessage="No payment history found." />
      </section>
    </DashboardLayout>
  );
}

export default PaymentHistoryPage;
