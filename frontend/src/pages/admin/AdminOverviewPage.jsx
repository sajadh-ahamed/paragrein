import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminDashboardSummary,
  getLatestAdminOrders,
} from "../../api/adminDashboardApi.js";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { getUser } from "../../utils/authStorage.js";
import {
  formatMoney,
  formatStatus,
  statusVariant,
} from "../../utils/formatters.js";

const emptySummary = {
  newOrderRequests: 0,
  verifiedToday: 0,
  pendingAdvance: 0,
  activeWorkers: 0,
  ordersReadyForPickup: 0,
  activePickups: 0,
  warehousePending: 0,
  completedDeliveries: 0,
  readyForDriverAssignmentCount: 0,
  activeDeliveriesCount: 0,
  availableDriversCount: 0,
};

const metricStyles = {
  green: ["bg-[#22C55E]/10 text-[#86EFAC]", "text-[#22C55E]"],
  blue: ["bg-[#3B82F6]/10 text-[#93C5FD]", "text-[#60A5FA]"],
  amber: ["bg-[#F59E0B]/10 text-[#FCD34D]", "text-[#F59E0B]"],
  violet: ["bg-[#A855F7]/10 text-[#D8B4FE]", "text-[#C084FC]"],
};

function MetricCard({ label, value, hint, tone = "green"}) {
  const [iconClass, valueClass] = metricStyles[tone];
  return (
    <article className="rounded-2xl border border-white/10 bg-[#121824] p-5 shadow-xl shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
            {label}
          </p>
          <p className={`mt-3 text-3xl font-black ${valueClass}`}>{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#94A3B8]">{hint}</p>
    </article>
  );
}

function AdminOverviewPage() {
  const user = getUser();
  const [summary, setSummary] = useState(emptySummary);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const [summaryData, orderData] = await Promise.all([
        getAdminDashboardSummary(),
        getLatestAdminOrders(),
      ]);
      setSummary(summaryData || emptySummary);
      setOrders(orderData || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const activeOrders =
    summary.activePickups +
    summary.warehousePending +
    summary.readyForDriverAssignmentCount +
    summary.activeDeliveriesCount;
  const rejectedInLatest = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.orderStatus === "REJECTED" ||
          order.financialStatus === "ADVANCE_REJECTED",
      ).length,
    [orders],
  );
  const dateLabel = new Intl.DateTimeFormat("en-LK", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const metrics = [
    {
      label: "Active Orders",
      value: activeOrders,
      hint: "Pickup, warehouse, dispatch, and delivery activity",
      tone: "green",
      icon: "↗",
    },
    {
      label: "Warehouse Status",
      value: summary.warehousePending,
      hint: `${summary.readyForDriverAssignmentCount} ready for driver assignment`,
      tone: "blue",
      icon: "W",
    },
    {
      label: "Finance Snapshot",
      value: summary.pendingAdvance,
      hint: `${summary.verifiedToday} advances verified today`,
      tone: "violet",
      icon: "Rs",
    },
    {
      label: "Driver Status",
      value: summary.availableDriversCount,
      hint: `${summary.activeDeliveriesCount} active deliveries`,
      tone: "amber",
      icon: "D",
    },
    {
      label: "Ready for Pickup",
      value: summary.ordersReadyForPickup,
      hint: "Orders ready for pickup assignment",
      tone: "amber",
      icon: "P",
    },
    {
      label: "Ready for Driver",
      value: summary.readyForDriverAssignmentCount,
      hint: "Warehouse-cleared orders awaiting drivers",
      tone: "blue",
      icon: "R",
    },
    {
      label: "Completed Deliveries",
      value: summary.completedDeliveries,
      hint: "Orders delivered successfully",
      tone: "green",
      icon: "✓",
    },
    {
      label: "Rejected Orders",
      value: rejectedInLatest,
      hint: "Rejected finance or orders in the latest 10",
      tone: "violet",
      icon: "!",
    },
  ];

  const columns = [
    {
      key: "trackingNumber",
      header: "Order ID / Tracking",
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#22C55E]/10 text-xs font-black text-[#86EFAC]">
            P
          </span>
          <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span>
        </div>
      ),
    },
    { key: "customerName", header: "Customer Name" },
    {
      key: "totalAmount",
      header: "Total Amount",
      render: (row) => (
        <span className="font-bold text-[#86EFAC]">
          {formatMoney(row.totalAmount)}
        </span>
      ),
    },
    {
      key: "orderStatus",
      header: "Status",
      render: (row) => (
        <div className="flex flex-col items-start gap-1.5">
          <StatusBadge variant={statusVariant(row.orderStatus)}>
            {formatStatus(row.orderStatus)}
          </StatusBadge>
          <span className="text-[11px] text-[#64748B]">
            {formatStatus(row.financialStatus)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/admin/orders/${row.id}`}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#CBD5E1] transition hover:border-[#22C55E]/40 hover:text-white"
          >
            View
          </Link>
          {row.financialStatus === "ADVANCE_VERIFIED" &&
            row.orderStatus === "PENDING_ADVANCE_VERIFICATION" && (
              <Link
                to="/admin/orders/ready-for-pickup"
                className="rounded-lg bg-[#22C55E] px-3 py-2 text-xs font-black text-[#07110B] transition hover:bg-[#2DDB6B]"
              >
                Assign Pickup
              </Link>
            )}
          {row.orderStatus === "READY_FOR_DISPATCH" && (
            <Link
              to="/admin/orders/ready-for-driver"
              className="rounded-lg bg-[#22C55E] px-3 py-2 text-xs font-black text-[#07110B] transition hover:bg-[#2DDB6B]"
            >
              Assign Driver
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-5 border-b border-white/10 pb-7 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#22C55E]">
              Logistics Management Control Center
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Dashboard Overview
            </h1>
          </div>
          <p className="mt-5 text-base font-bold text-[#CBD5E1]">
            Welcome to the Paragrein Admin Dashboard
          </p>
          <p className="mt-1 text-sm text-[#64748B]">
            Monitor orders, teams, warehouse movement, finance, and final
            delivery from one live overview.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-[#121824] px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B]">
              Today
            </p>
            <p className="mt-1 text-sm font-bold text-[#F8FAFC]">{dateLabel}</p>
          </div>
          <div className="rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#86EFAC]">
              Signed in as
            </p>
            <p className="mt-1 text-sm font-bold text-white">
              {user?.fullName || user?.username || "Administrator"}
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
          {error}
        </div>
      )}

      <section className="mt-7 rounded-2xl border border-white/10 bg-[#121824] p-5 shadow-2xl shadow-black/20 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#22C55E]">
              Live order feed
            </p>
            <h2 className="mt-2 text-xl font-black text-white">
              New Orders / Operational Orders
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Latest real customer orders with valid workflow actions.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center justify-center rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-black text-[#07110B] transition hover:bg-[#2DDB6B]"
          >
            View All Orders
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          emptyMessage="No orders found."
        />
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            {...metric}
            value={loading ? "..." : metric.value}
          />
        ))}
      </section>
    </DashboardLayout>
  );
}

export default AdminOverviewPage;
