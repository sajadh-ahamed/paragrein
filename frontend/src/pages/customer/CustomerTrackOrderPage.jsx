import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerOrders } from '../../api/customerOrderApi.js';
import { trackOrderPublic } from '../../api/publicTrackingApi.js';
import FormInput from '../../components/FormInput.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatStatus, statusVariant } from '../../utils/formatters.js';

function CustomerTrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState(null);
  const [ownedOrder, setOwnedOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function search(event) {
    event.preventDefault();
    setError('');
    setResult(null);
    setOwnedOrder(null);
    if (!trackingNumber.trim()) {
      setError('Tracking number is required.');
      return;
    }

    try {
      setLoading(true);
      const publicResult = await trackOrderPublic(trackingNumber.trim());
      setResult(publicResult);
      const myOrders = await getCustomerOrders();
      setOwnedOrder((myOrders || []).find((order) => order.trackingNumber === publicResult.trackingNumber) || null);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Customer"
        title="Track Order"
        description="Search by tracking number. Your own orders include a full details link; other valid tracking numbers show limited public status."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="pg-panel mt-6 max-w-3xl p-5">
        <form onSubmit={search} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <FormInput label="Tracking Number" value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} placeholder="PGR-2026-000001" />
          <PrimaryButton type="submit" disabled={loading}>{loading ? 'Searching...' : 'Search'}</PrimaryButton>
        </form>
      </section>

      {result && (
        <section className="pg-panel mt-6 max-w-3xl p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">{result.trackingNumber}</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">{result.publicMessage}</p>
            </div>
            <StatusBadge variant={statusVariant(result.orderStatus)}>{formatStatus(result.orderStatus)}</StatusBadge>
          </div>
          <p className="mt-4 text-sm text-[#94A3B8]">Financial status: {formatStatus(result.financialStatus)}</p>
          <p className="mt-1 text-sm text-[#94A3B8]">Last updated: {formatDateTime(result.lastUpdatedAt)}</p>
          {ownedOrder ? (
            <Link to={`/customer/orders/${ownedOrder.id}`} className="mt-5 inline-flex">
              <PrimaryButton>Open Full Details</PrimaryButton>
            </Link>
          ) : (
            <p className="mt-5 rounded-lg border border-[#263247] bg-[#111827] p-4 text-sm text-[#94A3B8]">
              This tracking number is available as a limited public result. Login as the owning customer for full details.
            </p>
          )}
        </section>
      )}
    </DashboardLayout>
  );
}

export default CustomerTrackOrderPage;
