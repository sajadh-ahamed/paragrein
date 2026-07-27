import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  assignDriver,
  assignPickupAgent,
  getActiveDeliveryAssignments,
  getAssignmentAvailableDrivers,
  getAssignmentAvailablePickupAgents,
} from '../../api/adminAssignmentApi.js';
import {
  getLatestAdminOrders,
  getOrdersReadyForDriver,
  getOrdersReadyForPickup,
} from '../../api/adminOrderApi.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatMoney, formatStatus, statusVariant } from '../../utils/formatters.js';

const tabs = [
  { key: 'ALL', label: 'All Orders' },
  { key: 'READY', label: 'Ready for Pickup Assignment' },
  { key: 'ASSIGNED_TO_PICKUP', label: 'Assigned to Pickup' },
  { key: 'READY_FOR_DRIVER', label: 'Ready for Driver Assignment' },
  { key: 'ASSIGNED_TO_DELIVERY', label: 'Assigned to Delivery' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'COMPLETED', label: 'Completed/Future' },
];

function OrdersManagementPage({ defaultTab = 'ALL' }) {
  const [tab, setTab] = useState(defaultTab);
  const [latestOrders, setLatestOrders] = useState([]);
  const [readyPickupOrders, setReadyPickupOrders] = useState([]);
  const [readyDriverOrders, setReadyDriverOrders] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [assignmentOrder, setAssignmentOrder] = useState(null);
  const [assignmentType, setAssignmentType] = useState('PICKUP');
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError('');
      const [latest, readyPickup, readyDriver, deliveries] = await Promise.all([
        getLatestAdminOrders(),
        getOrdersReadyForPickup(),
        getOrdersReadyForDriver(),
        getActiveDeliveryAssignments(),
      ]);
      setLatestOrders(latest || []);
      setReadyPickupOrders(readyPickup || []);
      setReadyDriverOrders(readyDriver || []);
      setActiveDeliveries(deliveries || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const visibleOrders = useMemo(() => {
    if (tab === 'READY') {
      return readyPickupOrders;
    }
    if (tab === 'READY_FOR_DRIVER') {
      return readyDriverOrders;
    }
    if (tab === 'ASSIGNED_TO_DELIVERY') {
      return activeDeliveries;
    }
    if (tab === 'ASSIGNED_TO_PICKUP') {
      return latestOrders.filter((order) => order.orderStatus === 'ASSIGNED_TO_PICKUP');
    }
    if (tab === 'REJECTED') {
      return latestOrders.filter((order) => order.orderStatus === 'REJECTED');
    }
    if (tab === 'COMPLETED') {
      return latestOrders.filter((order) => ['DELIVERED'].includes(order.orderStatus));
    }
    return latestOrders;
  }, [activeDeliveries, latestOrders, readyDriverOrders, readyPickupOrders, tab]);

  async function openPickupModal(order) {
    setAssignmentType('PICKUP');
    setAssignmentOrder(order);
    setSelectedWorkerId('');
    setAssignmentNote(`Assigned for parcel collection: ${order.trackingNumber}`);
    setError('');
    try {
      const data = await getAssignmentAvailablePickupAgents();
      setWorkers(data || []);
    } catch (apiError) {
      setError(apiError.message);
      setWorkers([]);
    }
  }

  async function openDriverModal(order) {
    setAssignmentType('DELIVERY');
    setAssignmentOrder(order);
    setSelectedWorkerId('');
    setAssignmentNote(`Assigned for final delivery: ${order.trackingNumber}`);
    setError('');
    try {
      const data = await getAssignmentAvailableDrivers();
      setWorkers(data || []);
    } catch (apiError) {
      setError(apiError.message);
      setWorkers([]);
    }
  }

  async function submitAssignment(event) {
    event.preventDefault();
    if (!selectedWorkerId) {
      setError(`Please select an available ${assignmentType === 'DELIVERY' ? 'driver' : 'pickup agent'}.`);
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      if (assignmentType === 'DELIVERY') {
        await assignDriver(assignmentOrder.id, Number(selectedWorkerId), assignmentNote);
        setSuccess(`Driver assigned to ${assignmentOrder.trackingNumber}.`);
      } else {
        await assignPickupAgent(assignmentOrder.id, Number(selectedWorkerId), assignmentNote);
        setSuccess(`Pickup agent assigned to ${assignmentOrder.trackingNumber}.`);
      }
      setAssignmentOrder(null);
      await loadOrders();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  const baseColumns = [
    { key: 'trackingNumber', header: 'Tracking Number', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'receiverName', header: 'Receiver' },
    { key: 'pickupAddress', header: 'Pickup Address' },
    { key: 'dropoffAddress', header: 'Drop-off Address' },
    { key: 'totalAmount', header: 'Total', render: (row) => formatMoney(row.totalAmount) },
    { key: 'advanceAmount', header: 'Advance', render: (row) => <span className="font-semibold text-[#86EFAC]">{formatMoney(row.advanceAmount)}</span> },
    { key: 'orderStatus', header: 'Order Status', render: (row) => <StatusBadge variant={statusVariant(row.orderStatus)}>{formatStatus(row.orderStatus)}</StatusBadge> },
    { key: 'financialStatus', header: 'Financial Status', render: (row) => <StatusBadge variant={statusVariant(row.financialStatus)}>{formatStatus(row.financialStatus)}</StatusBadge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link to={`/admin/orders/${row.id}`}>
            <SecondaryButton className="px-3 py-1.5 text-xs">View Details</SecondaryButton>
          </Link>
          {row.financialStatus === 'ADVANCE_VERIFIED' && row.orderStatus === 'PENDING_ADVANCE_VERIFICATION' && (
            <PrimaryButton onClick={() => openPickupModal(row)} className="px-3 py-1.5 text-xs">Assign Pickup</PrimaryButton>
          )}
          {row.orderStatus === 'READY_FOR_DISPATCH' && (
            <PrimaryButton onClick={() => openDriverModal(row)} className="px-3 py-1.5 text-xs">Assign Driver</PrimaryButton>
          )}
        </div>
      ),
    },
  ];

  const readyDriverColumns = [
    { key: 'trackingNumber', header: 'Tracking Number', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'receiverName', header: 'Receiver' },
    { key: 'dropoffAddress', header: 'Drop-off Address' },
    { key: 'parcelDescription', header: 'Parcel' },
    { key: 'storageZone', header: 'Storage Zone' },
    { key: 'readyForDispatchAt', header: 'Ready At', render: (row) => formatDateTime(row.readyForDispatchAt) },
    { key: 'totalAmount', header: 'Total', render: (row) => formatMoney(row.totalAmount) },
    { key: 'balanceAmount', header: 'Balance', render: (row) => <span className="font-semibold text-[#FCD34D]">{formatMoney(row.balanceAmount)}</span> },
    { key: 'orderStatus', header: 'Status', render: (row) => <StatusBadge variant={statusVariant(row.orderStatus)}>{formatStatus(row.orderStatus)}</StatusBadge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link to={`/admin/orders/${row.id}`}>
            <SecondaryButton className="px-3 py-1.5 text-xs">View Details</SecondaryButton>
          </Link>
          <PrimaryButton onClick={() => openDriverModal(row)} className="px-3 py-1.5 text-xs">Assign Driver</PrimaryButton>
        </div>
      ),
    },
  ];

  const activeDeliveryColumns = [
    { key: 'trackingNumber', header: 'Tracking Number', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'receiverName', header: 'Receiver' },
    { key: 'dropoffAddress', header: 'Drop-off Address' },
    { key: 'driverName', header: 'Driver' },
    { key: 'driverUsername', header: 'Username' },
    { key: 'assignmentStatus', header: 'Assignment', render: (row) => <StatusBadge variant={statusVariant(row.assignmentStatus)}>{formatStatus(row.assignmentStatus)}</StatusBadge> },
    { key: 'orderStatus', header: 'Order Status', render: (row) => <StatusBadge variant={statusVariant(row.orderStatus)}>{formatStatus(row.orderStatus)}</StatusBadge> },
    { key: 'assignedAt', header: 'Assigned At', render: (row) => formatDateTime(row.assignedAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Link to={`/admin/orders/${row.orderId}`}>
          <SecondaryButton className="px-3 py-1.5 text-xs">View Order</SecondaryButton>
        </Link>
      ),
    },
  ];

  const columns = tab === 'READY_FOR_DRIVER'
    ? readyDriverColumns
    : tab === 'ASSIGNED_TO_DELIVERY'
      ? activeDeliveryColumns
      : baseColumns;

  const isDelivery = assignmentType === 'DELIVERY';
  const workerLabel = isDelivery ? 'Driver' : 'Pickup Agent';

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin"
        title="Orders Management"
        description="Review orders and assign pickup or delivery staff after each operational checkpoint is complete."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      {success && <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{success}</div>}

      <section className="mt-6 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${tab === item.key ? 'bg-[#22C55E] text-[#07110B]' : 'border border-[#263247] bg-[#111827] text-[#CBD5E1] hover:border-[#22C55E]/60'}`}
          >
            {item.label}
          </button>
        ))}
      </section>

      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={visibleOrders} loading={loading} emptyMessage="No orders found for this view." />
      </section>

      <Modal
        open={Boolean(assignmentOrder)}
        title={`Assign ${workerLabel}`}
        description={assignmentOrder ? `Select an available ${workerLabel.toLowerCase()} for ${assignmentOrder.trackingNumber}.` : ''}
        onClose={() => setAssignmentOrder(null)}
      >
        <form onSubmit={submitAssignment} className="grid gap-5">
          <label className="block">
            <span className="pg-label">Available {workerLabel}</span>
            <select className="pg-field mt-2" value={selectedWorkerId} onChange={(event) => setSelectedWorkerId(event.target.value)}>
              <option value="">Select {workerLabel.toLowerCase()}</option>
              {workers.map((worker) => (
                <option key={worker.userId} value={worker.userId}>
                  {worker.fullName} ({worker.username}) - {worker.employeeNumber} - {formatStatus(worker.availabilityStatus)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="pg-label">Assignment Note</span>
            <textarea className="pg-field mt-2 min-h-24" value={assignmentNote} onChange={(event) => setAssignmentNote(event.target.value)} />
          </label>
          {workers.length === 0 && <p className="rounded-md border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-4 py-3 text-sm text-[#FCD34D]">No available {workerLabel.toLowerCase()}s found. Create or activate an available employee first.</p>}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <SecondaryButton onClick={() => setAssignmentOrder(null)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" disabled={submitting || workers.length === 0}>{submitting ? 'Assigning...' : 'Confirm Assignment'}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

export default OrdersManagementPage;
