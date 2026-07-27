import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { confirmWarehouseArrival, getWarehouseOrderDetail, markReadyForDispatch } from '../../api/warehouseApi.js';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatMoney, formatProductMessage, formatStatus, statusVariant } from '../../utils/formatters.js';

const initialForm = {
  parcelCondition: '',
  storageZone: '',
  storageRack: '',
  notes: '',
};

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[#64748B]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#F8FAFC]">{formatProductMessage(value) || '-'}</p>
    </div>
  );
}

function WarehouseOrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [modalMode, setModalMode] = useState('');
  const [form, setForm] = useState(initialForm);
  const [readyNote, setReadyNote] = useState('Parcel checked and ready for dispatch.');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  async function loadOrder() {
    try {
      setLoading(true);
      setError('');
      const data = await getWarehouseOrderDetail(orderId);
      setOrder(data);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  function openArrivalModal() {
    setForm(initialForm);
    setModalMode('arrival');
    setError('');
    setSuccess('');
  }

  function openReadyModal() {
    setReadyNote('Parcel checked and ready for dispatch.');
    setModalMode('ready');
    setError('');
    setSuccess('');
  }

  async function submitArrival(event) {
    event.preventDefault();
    if (!form.parcelCondition.trim() || !form.storageZone.trim()) {
      setError('Parcel condition and storage zone are required.');
      return;
    }
    try {
      setProcessing(true);
      const updated = await confirmWarehouseArrival(order.id, form);
      setOrder(updated);
      setSuccess(`Warehouse arrival confirmed for ${order.trackingNumber}.`);
      setModalMode('');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setProcessing(false);
    }
  }

  async function submitReady() {
    try {
      setProcessing(true);
      const updated = await markReadyForDispatch(order.id, readyNote);
      setOrder(updated);
      setSuccess(`${order.trackingNumber} marked ready for dispatch.`);
      setModalMode('');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Warehouse Order"
        title={order?.trackingNumber || 'Warehouse Order Detail'}
        description="Review parcel, pickup, warehouse record, and timeline information before moving the order forward."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      {success && <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{success}</div>}
      {loading && <div className="pg-panel mt-6 p-6 text-sm text-[#94A3B8]">Loading warehouse order...</div>}

      {!loading && order && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <section className="pg-panel p-5">
            <div className="flex flex-col gap-3 border-b border-[#263247] pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#F8FAFC]">{order.trackingNumber}</h2>
                <p className="mt-1 text-sm text-[#94A3B8]">Customer: {order.customerName}</p>
              </div>
              <StatusBadge variant={statusVariant(order.orderStatus)}>{formatStatus(order.orderStatus)}</StatusBadge>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <DetailItem label="Sender" value={order.senderName} />
              <DetailItem label="Sender Phone" value={order.senderPhone} />
              <DetailItem label="Sender Address" value={order.senderAddress} />
              <DetailItem label="Receiver" value={order.receiverName} />
              <DetailItem label="Receiver Phone" value={order.receiverPhone} />
              <DetailItem label="Receiver Address" value={order.receiverAddress} />
              <DetailItem label="Pickup Address" value={order.pickupAddress} />
              <DetailItem label="Drop-off Address" value={order.dropoffAddress} />
              <DetailItem label="Parcel" value={order.parcelDescription} />
              <DetailItem label="Weight" value={`${order.parcelWeightKg || 0} kg`} />
              <DetailItem label="Route Distance" value={`${order.routeDistanceKm || 0} km`} />
              <DetailItem label="Total Amount" value={formatMoney(order.totalAmount)} />
              <DetailItem label="Pickup Agent" value={order.pickupAgentName || order.pickupAgentUsername} />
              <DetailItem label="Pickup Completed" value={formatDateTime(order.pickupCompletedAt)} />
            </div>

            <div className="mt-6 rounded-lg border border-[#263247] bg-[#111827] p-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#94A3B8]">Warehouse Record</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <DetailItem label="Parcel Condition" value={order.warehouseRecord?.parcelCondition} />
                <DetailItem label="Storage Zone" value={order.warehouseRecord?.storageZone} />
                <DetailItem label="Storage Rack" value={order.warehouseRecord?.storageRack} />
                <DetailItem label="Received By" value={order.warehouseRecord?.receivedByName || order.warehouseRecord?.receivedByUsername} />
                <DetailItem label="Received At" value={formatDateTime(order.warehouseRecord?.receivedAt)} />
                <DetailItem label="Ready for Dispatch At" value={formatDateTime(order.warehouseRecord?.readyForDispatchAt)} />
                <DetailItem label="Notes" value={order.warehouseRecord?.notes} />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/warehouse/arrival-queue">
                <SecondaryButton>Back to Arrival Queue</SecondaryButton>
              </Link>
              {order.orderStatus === 'ARRIVED_AT_WAREHOUSE' && <PrimaryButton onClick={openArrivalModal}>Confirm Arrival</PrimaryButton>}
              {order.orderStatus === 'WAREHOUSE_PROCESSING' && <PrimaryButton onClick={openReadyModal}>Mark Ready for Dispatch</PrimaryButton>}
            </div>
          </section>

          <section className="pg-panel p-5">
            <h2 className="text-lg font-bold text-[#F8FAFC]">Status Timeline</h2>
            <div className="mt-5 space-y-4">
              {(order.timeline || []).map((item) => (
                <div key={item.id} className="rounded-lg border border-[#263247] bg-[#111827] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge variant={statusVariant(item.newStatus)}>{formatStatus(item.newStatus)}</StatusBadge>
                    <span className="text-xs text-[#64748B]">{formatDateTime(item.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#CBD5E1]">{item.note || 'Status updated.'}</p>
                  <p className="mt-1 text-xs text-[#64748B]">By {item.changedBy}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <Modal open={modalMode === 'arrival'} title="Confirm Warehouse Arrival" description={order ? `Record warehouse details for ${order.trackingNumber}.` : ''} onClose={() => setModalMode('')}>
        <form onSubmit={submitArrival} className="grid gap-4">
          <label className="block">
            <span className="pg-label">Parcel Condition</span>
            <input className="pg-field mt-2" value={form.parcelCondition} onChange={(event) => setForm({ ...form, parcelCondition: event.target.value })} />
          </label>
          <label className="block">
            <span className="pg-label">Storage Zone</span>
            <input className="pg-field mt-2" value={form.storageZone} onChange={(event) => setForm({ ...form, storageZone: event.target.value })} />
          </label>
          <label className="block">
            <span className="pg-label">Storage Rack</span>
            <input className="pg-field mt-2" value={form.storageRack} onChange={(event) => setForm({ ...form, storageRack: event.target.value })} />
          </label>
          <label className="block">
            <span className="pg-label">Notes</span>
            <textarea className="pg-field mt-2 min-h-24" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </label>
          <div className="flex justify-end gap-3">
            <SecondaryButton onClick={() => setModalMode('')}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" disabled={processing}>{processing ? 'Confirming...' : 'Confirm Arrival'}</PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal open={modalMode === 'ready'} title="Mark Ready for Dispatch" description={order ? `Confirm dispatch readiness for ${order.trackingNumber}.` : ''} onClose={() => setModalMode('')}>
        <label className="block">
          <span className="pg-label">Action Note</span>
          <textarea className="pg-field mt-2 min-h-24" value={readyNote} onChange={(event) => setReadyNote(event.target.value)} />
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <SecondaryButton onClick={() => setModalMode('')}>Cancel</SecondaryButton>
          <PrimaryButton onClick={submitReady} disabled={processing}>{processing ? 'Updating...' : 'Confirm Ready'}</PrimaryButton>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default WarehouseOrderDetailPage;
