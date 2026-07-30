import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFinanceDashboardSummary } from '../../api/financeApi.js';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StatCard from '../../components/StatCard.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatMoney } from '../../utils/formatters.js';

function FinanceOverviewPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    try {
      setLoading(true);
      const data = await getFinanceDashboardSummary();
      setSummary(data);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const value = (key) => (loading ? '...' : summary?.[key] ?? 0);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Finance"
        title="Finance Overview"
        description="Review advance payment submissions, verify valid references, reject invalid payments, and prepare orders for admin assignment."
        actions={(
          <div className="flex flex-wrap gap-3">
            <Link to="/finance/payment-verification"><PrimaryButton>Review Pending</PrimaryButton></Link>
          </div>
        )}
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Pending Advances" value={value('pendingAdvanceCount')} hint="Needs finance review" tone="amber" />
        <StatCard label="Verified Advances" value={value('verifiedAdvanceCount')} hint="Ready for admin assignment" />
        <StatCard label="Rejected Payments" value={value('rejectedAdvanceCount')} hint="Rejected advance submissions" tone="amber" />
        <StatCard label="Verified Advance Amount" value={loading ? '...' : formatMoney(summary?.totalVerifiedAdvanceAmount)} hint="Total verified advance amount" />
        <StatCard label="Outstanding Balances" value={loading ? '...' : formatMoney(summary?.totalOutstandingBalanceAmount)} hint="Balance due after verified advances" tone="blue" />
        <StatCard label="Ready for Admin Assignment" value={value('totalOrdersReadyForAdminAssignment')} hint="Verified orders awaiting assignment" />
      </section>

      <section className="pg-panel mt-6 p-5">
        <h2 className="text-xl font-bold">Finance Controls</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#94A3B8]">
          Finance officers verify or reject customer advance payment submissions, review payment history, and monitor outstanding balances.
        </p>
      </section>
    </DashboardLayout>
  );
}

export default FinanceOverviewPage;
