import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerOrders } from '../../api/customerOrderApi.js';
import { brandImages } from '../../assets/imageAssets.js';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatMoney, formatProductMessage, formatStatus, statusVariant } from '../../utils/formatters.js';

function CustomerOverviewPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await getCustomerOrders();
      setOrders(data || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((order) => order.orderStatus === 'PENDING_ADVANCE_VERIFICATION').length,
    inTransit: orders.filter((order) => order.orderStatus?.includes('TRANSIT')).length,
    delivered: orders.filter((order) => order.orderStatus === 'DELIVERED').length,
  }), [orders]);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Customer"
        title="Customer Overview"
        description="Create delivery orders, submit advance payment references, and track your parcels from one dark Paragrein workspace."
        actions={<Link to="/customer/create-order"><PrimaryButton>Create Order</PrimaryButton></Link>}
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="relative mt-6 overflow-hidden rounded-xl border border-slate-700/60 bg-[#151B2B] shadow-xl shadow-black/20">
        <img src={brandImages.clientsideBg1} alt="Warehouse logistics customer overview" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050914]/95 via-[#050914]/78 to-[#050914]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050914]/55 via-transparent to-transparent" />
        <div className="relative z-10 max-w-3xl p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#86EFAC] drop-shadow">Customer Logistics Workspace</p>
          <h2 className="mt-4 text-2xl font-black text-white drop-shadow md:text-3xl">Create, pay, and track from one local dashboard.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 drop-shadow-sm md:text-base">
            Book a parcel and follow each verified handoff through pickup, warehouse processing, and final delivery.
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Orders" value={loading ? '...' : stats.total} hint="Your submitted parcel requests" />
        <StatCard label="Pending Verification" value={loading ? '...' : stats.pending} hint="Awaiting finance review" tone="amber" />
        <StatCard label="In Transit" value={loading ? '...' : stats.inTransit} hint="Moving through active operations" tone="blue" />
        <StatCard label="Delivered" value={loading ? '...' : stats.delivered} hint="Completed deliveries" />
      </section>

      <section className="pg-panel mt-6 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">Latest customer order activity.</p>
          </div>
          <Link to="/customer/orders" className="text-sm font-semibold text-[#22C55E] hover:underline">View all orders</Link>
        </div>

        <div className="mt-5 grid gap-3">
          {loading && <p className="text-sm text-[#94A3B8]">Loading your orders...</p>}
          {!loading && orders.slice(0, 4).map((order) => (
            <Link key={order.id} to={`/customer/orders/${order.id}`} className="rounded-lg border border-[#263247] bg-[#111827] p-4 transition hover:border-[#22C55E]/60">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-[#F8FAFC]">{order.trackingNumber}</p>
                  <p className="mt-1 text-sm text-[#94A3B8]">To {formatProductMessage(order.receiverName)} via {order.dropoffAddress}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge variant={statusVariant(order.orderStatus)}>{formatStatus(order.orderStatus)}</StatusBadge>
                  <span className="text-sm font-bold text-[#86EFAC]">{formatMoney(order.totalAmount)}</span>
                </div>
              </div>
            </Link>
          ))}
          {!loading && orders.length === 0 && (
            <p className="rounded-lg border border-[#263247] bg-[#111827] p-4 text-sm text-[#94A3B8]">No orders yet. Create your first parcel delivery request.</p>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default CustomerOverviewPage;
