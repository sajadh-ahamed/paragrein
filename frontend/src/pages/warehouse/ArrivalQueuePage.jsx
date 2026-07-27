import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { confirmWarehouseArrival, getArrivalQueue } from '../../api/warehouseApi.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatStatus, statusVariant } from '../../utils/formatters.js';

const initialForm = {
  parcelCondition: '',
  storageZone: '',
  storageRack: '',
  notes: '',
};

function ArrivalQueuePage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    try {
      setLoading(true);
      setError('');
      const data = await getArrivalQueue();
      setOrders(data || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  function openConfirm(order) {
    setSelectedOrder(order);
    setForm(initialForm);
    setError('');
    setSuccess('');
  }

  async function submitConfirm(event) {
    event.preventDefault();
    if (!form.parcelCondition.trim() || !form.storageZone.trim()) {
      setError('Parcel condition and storage zone are required.');
      return;
    }
    try {
      setSubmitting(true);
      await confirmWarehouseArrival(selectedOrder.id, form);
      setSuccess(`Warehouse arrival confirmed for ${selectedOrder.trackingNumber}.`);
      setSelectedOrder(null);
      await loadQueue();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { key: 'trackingNumber', header: 'Tracking Number', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'senderName', header: 'Sender' },
    { key: 'receiverName', header: 'Receiver' },
    { key: 'parcelDescription', header: 'Parcel' },
    { key: 'parcelWeightKg', header: 'Weight', render: (row) => `${row.parcelWeightKg || 0} kg` },
    { key: 'pickupAddress', header: 'Pickup Address' },
    { key: 'dropoffAddress', header: 'Drop-off Address' },
    { key: 'orderStatus', header: 'Current Status', render: (row) => <StatusBadge variant={statusVariant(row.orderStatus)}>{formatStatus(row.orderStatus)}</StatusBadge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link to={`/warehouse/orders/${row.id}`}>
            <SecondaryButton className="px-3 py-1.5 text-xs">View Details</SecondaryButton>
          </Link>
          <PrimaryButton onClick={() => openConfirm(row)} className="px-3 py-1.5 text-xs">Confirm Arrival</PrimaryButton>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Warehouse"
        title="Arrival Queue"
        description="Confirm parcels that have reached the warehouse after pickup completion."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      {success && <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{success}</div>}

      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={orders.map((order) => ({ ...order, key: order.id }))} loading={loading} emptyMessage="No parcels are waiting for warehouse confirmation." />
      </section>

      <Modal open={Boolean(selectedOrder)} title="Confirm Warehouse Arrival" description={selectedOrder ? `Record warehouse details for ${selectedOrder.trackingNumber}.` : ''} onClose={() => setSelectedOrder(null)}>
        <form onSubmit={submitConfirm} className="grid gap-4">
          <label className="block">
            <span className="pg-label">Parcel Condition</span>
            <input className="pg-field mt-2" value={form.parcelCondition} onChange={(event) => setForm({ ...form, parcelCondition: event.target.value })} placeholder="Good condition / Damaged box" />
          </label>
          <label className="block">
            <span className="pg-label">Storage Zone</span>
            <input className="pg-field mt-2" value={form.storageZone} onChange={(event) => setForm({ ...form, storageZone: event.target.value })} placeholder="Zone A" />
          </label>
          <label className="block">
            <span className="pg-label">Storage Rack</span>
            <input className="pg-field mt-2" value={form.storageRack} onChange={(event) => setForm({ ...form, storageRack: event.target.value })} placeholder="Rack 03" />
          </label>
          <label className="block">
            <span className="pg-label">Notes</span>
            <textarea className="pg-field mt-2 min-h-24" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </label>
          <div className="flex justify-end gap-3">
            <SecondaryButton onClick={() => setSelectedOrder(null)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" disabled={submitting}>{submitting ? 'Confirming...' : 'Confirm Arrival'}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

export default ArrivalQueuePage;
