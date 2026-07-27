import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  assignDriver,
  assignPickupAgent,
  getAssignmentAvailableDrivers,
  getAssignmentAvailablePickupAgents,
} from '../../api/adminAssignmentApi.js';
import { getAdminOrderDetail } from '../../api/adminOrderApi.js';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatMoney, formatProductMessage, formatStatus, statusVariant } from '../../utils/formatters.js';

function AdminOrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [agents, setAgents] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [driverAssignmentNote, setDriverAssignmentNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  async function loadOrder() {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminOrderDetail(orderId);
      setOrder(data);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  async function openAssignModal() {
    setModalOpen(true);
    setSelectedAgentId('');
    setAssignmentNote(`Assigned for parcel collection: ${order.trackingNumber}`);
    try {
      const data = await getAssignmentAvailablePickupAgents();
      setAgents(data || []);
    } catch (apiError) {
      setError(apiError.message);
      setAgents([]);
    }
  }

  async function openDriverModal() {
    setDriverModalOpen(true);
    setSelectedDriverId('');
    setDriverAssignmentNote(`Assigned for final delivery: ${order.trackingNumber}`);
    try {
      const data = await getAssignmentAvailableDrivers();
      setDrivers(data || []);
    } catch (apiError) {
      setError(apiError.message);
      setDrivers([]);
    }
  }

  async function submitAssignment(event) {
    event.preventDefault();
    if (!selectedAgentId) {
      setError('Please select an available pickup agent.');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      await assignPickupAgent(order.id, Number(selectedAgentId), assignmentNote);
      setSuccess('Pickup assignment created successfully.');
      setModalOpen(false);
      await loadOrder();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitDriverAssignment(event) {
    event.preventDefault();
    if (!selectedDriverId) {
      setError('Please select an available driver.');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      await assignDriver(order.id, Number(selectedDriverId), driverAssignmentNote);
      setSuccess('Driver assignment created successfully.');
      setDriverModalOpen(false);
      await loadOrder();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin Order"
        title={order?.trackingNumber || 'Order Detail'}
        description="Review customer, parcel, payment, and assignment readiness details."
        actions={(
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/orders"><SecondaryButton>Back to Orders</SecondaryButton></Link>
            {order?.pickupAssignable && <PrimaryButton onClick={openAssignModal}>Assign Pickup</PrimaryButton>}
            {order?.driverAssignable && <PrimaryButton onClick={openDriverModal}>Assign Driver</PrimaryButton>}
          </div>
        )}
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      {success && <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{success}</div>}
      {loading && <div className="pg-panel mt-6 p-6 text-sm text-[#94A3B8]">Loading order details...</div>}

      {order && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="pg-panel p-5">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info label="Customer" value={`${order.customerName} (${order.customerEmail})`} />
              <Info label="Customer Phone" value={order.customerPhone} />
              <Info label="Receiver" value={formatProductMessage(order.receiverName)} />
              <Info label="Route" value={`${order.pickupAddress} to ${order.dropoffAddress}`} />
              <Info label="Order Status" value={<StatusBadge variant={statusVariant(order.orderStatus)}>{formatStatus(order.orderStatus)}</StatusBadge>} />
              <Info label="Financial Status" value={<StatusBadge variant={statusVariant(order.financialStatus)}>{formatStatus(order.financialStatus)}</StatusBadge>} />
            </div>
          </section>

          <section className="pg-panel p-5">
            <h2 className="text-xl font-bold">Payment & Cost</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info label="Payment Reference" value={order.paymentReference || '-'} />
              <Info label="Payment Status" value={formatStatus(order.paymentStatus)} />
              <Info label="Total Amount" value={formatMoney(order.totalAmount)} />
              <Info label="Advance Amount" value={formatMoney(order.advanceAmount)} />
              <Info label="Balance Amount" value={formatMoney(order.balanceAmount)} />
              <Info label="Route Distance" value={`${order.routeDistanceKm} km`} />
            </div>
          </section>

          <section className="pg-panel p-5">
            <h2 className="text-xl font-bold">Sender & Receiver</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info label="Sender" value={`${order.senderName} - ${order.senderPhone}`} />
              <Info label="Sender Address" value={order.senderAddress} />
              <Info label="Receiver" value={`${formatProductMessage(order.receiverName)} - ${order.receiverPhone}`} />
              <Info label="Receiver Address" value={order.receiverAddress} />
            </div>
          </section>

          <section className="pg-panel p-5">
            <h2 className="text-xl font-bold">Parcel</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info label="Description" value={order.parcelDescription} />
              <Info label="Weight" value={`${order.parcelWeightKg} kg`} />
              <Info label="Base Rate" value={formatMoney(order.baseRate)} />
              <Info label="Per KM Rate" value={formatMoney(order.perKmRate)} />
            </div>
          </section>

          <section className="pg-panel p-5 xl:col-span-2">
            <h2 className="text-xl font-bold">Timeline</h2>
            <div className="mt-5 grid gap-3">
              {(order.timeline || []).map((item) => (
                <div key={item.id} className="rounded-lg border border-[#263247] bg-[#111827] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <StatusBadge variant={statusVariant(item.newStatus)}>{formatStatus(item.newStatus)}</StatusBadge>
                    <span className="text-xs text-[#94A3B8]">{formatDateTime(item.createdAt)}</span>
                  </div>
                  <p className="mt-3 text-sm text-[#CBD5E1]">{item.note || 'No note provided.'}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <Modal open={modalOpen} title="Assign Pickup Agent" description="Only available pickup agents can be assigned." onClose={() => setModalOpen(false)}>
        <form onSubmit={submitAssignment} className="grid gap-5">
          <label className="block">
            <span className="pg-label">Available Pickup Agent</span>
            <select className="pg-field mt-2" value={selectedAgentId} onChange={(event) => setSelectedAgentId(event.target.value)}>
              <option value="">Select pickup agent</option>
              {agents.map((agent) => (
                <option key={agent.userId} value={agent.userId}>{agent.fullName} ({agent.employeeNumber})</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="pg-label">Assignment Note</span>
            <textarea className="pg-field mt-2 min-h-24" value={assignmentNote} onChange={(event) => setAssignmentNote(event.target.value)} />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <SecondaryButton onClick={() => setModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" disabled={submitting || agents.length === 0}>{submitting ? 'Assigning...' : 'Confirm Assignment'}</PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal open={driverModalOpen} title="Assign Driver" description="Only available drivers can be assigned for final delivery." onClose={() => setDriverModalOpen(false)}>
        <form onSubmit={submitDriverAssignment} className="grid gap-5">
          <label className="block">
            <span className="pg-label">Available Driver</span>
            <select className="pg-field mt-2" value={selectedDriverId} onChange={(event) => setSelectedDriverId(event.target.value)}>
              <option value="">Select driver</option>
              {drivers.map((driver) => (
                <option key={driver.userId} value={driver.userId}>{driver.fullName} ({driver.employeeNumber})</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="pg-label">Assignment Note</span>
            <textarea className="pg-field mt-2 min-h-24" value={driverAssignmentNote} onChange={(event) => setDriverAssignmentNote(event.target.value)} />
          </label>
          {drivers.length === 0 && <p className="rounded-md border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-4 py-3 text-sm text-[#FCD34D]">No available drivers found. Create or activate an available driver first.</p>}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <SecondaryButton onClick={() => setDriverModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" disabled={submitting || drivers.length === 0}>{submitting ? 'Assigning...' : 'Confirm Assignment'}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-[#263247] bg-[#111827] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">{label}</p>
      <div className="mt-2 text-sm font-semibold text-[#F8FAFC]">{value || '-'}</div>
    </div>
  );
}

export default AdminOrderDetailPage;
