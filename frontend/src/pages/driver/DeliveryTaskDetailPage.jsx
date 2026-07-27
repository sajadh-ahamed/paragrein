import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { acceptDelivery, completeDelivery, getDeliveryTaskDetail, markReachedDestination } from '../../api/driverApi.js';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatMoney, formatProductMessage, formatStatus, statusVariant } from '../../utils/formatters.js';

function nextAction(task) {
  if (task?.assignmentStatus === 'ASSIGNED' && task?.orderStatus === 'ASSIGNED_TO_DELIVERY') {
    return { key: 'accept', label: 'Accept Delivery', note: 'Delivery task accepted by driver.' };
  }
  if (task?.assignmentStatus === 'ACCEPTED' && task?.orderStatus === 'DELIVERY_ACCEPTED') {
    return { key: 'destination', label: 'Mark Reached Destination', note: 'Driver reached destination.' };
  }
  if (task?.assignmentStatus === 'ACCEPTED' && task?.orderStatus === 'REACHED_DESTINATION') {
    return { key: 'complete', label: 'Complete Delivery' };
  }
  return null;
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[#64748B]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#F8FAFC]">{formatProductMessage(value) || '-'}</p>
    </div>
  );
}

function DeliveryTaskDetailPage() {
  const { assignmentId } = useParams();
  const [task, setTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [note, setNote] = useState('');
  const [completion, setCompletion] = useState({ recipientName: '', balanceCollectedAmount: '', deliveryNotes: '', proofImagePath: '' });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadTask();
  }, [assignmentId]);

  async function loadTask() {
    try {
      setLoading(true);
      setError('');
      const data = await getDeliveryTaskDetail(assignmentId);
      setTask(data);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  function openActionModal() {
    const action = nextAction(task);
    setNote(action?.note || '');
    setCompletion({
      recipientName: task.receiverName || '',
      balanceCollectedAmount: task.balanceAmount || '',
      deliveryNotes: 'Delivered successfully.',
      proofImagePath: task.deliveryConfirmation?.proofImagePath || '',
    });
    setModalOpen(true);
    setError('');
    setSuccess('');
  }

  async function submitAction() {
    const action = nextAction(task);
    if (!action) {
      setError('No valid next action is available for this delivery task.');
      return;
    }
    if (action.key === 'complete' && (!completion.recipientName || !completion.balanceCollectedAmount)) {
      setError('Recipient name and balance collected amount are required.');
      return;
    }
    if (action.key === 'complete' && Number(completion.balanceCollectedAmount) !== Number(task.balanceAmount)) {
      setError(`Collected balance must match ${formatMoney(task.balanceAmount)}.`);
      return;
    }

    try {
      setProcessing(true);
      let updated;
      if (action.key === 'accept') {
        updated = await acceptDelivery(task.assignmentId, note);
      } else if (action.key === 'destination') {
        updated = await markReachedDestination(task.assignmentId, note);
      } else {
        updated = await completeDelivery(task.assignmentId, {
          ...completion,
          balanceCollectedAmount: Number(completion.balanceCollectedAmount),
        });
      }
      setTask(updated);
      setSuccess(`${action.label} completed for ${task.trackingNumber}.`);
      setModalOpen(false);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setProcessing(false);
    }
  }

  const action = nextAction(task);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Delivery Task"
        title={task?.trackingNumber || 'Delivery Details'}
        description="Review receiver, parcel, balance, and timeline details before moving the delivery forward."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      {success && <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{success}</div>}

      {loading && <div className="pg-panel mt-6 p-6 text-sm text-[#94A3B8]">Loading delivery task...</div>}

      {!loading && task && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <section className="pg-panel p-5">
            <div className="flex flex-col gap-3 border-b border-[#263247] pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#F8FAFC]">{task.trackingNumber}</h2>
                <p className="mt-1 text-sm text-[#94A3B8]">Assigned at {formatDateTime(task.assignedAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge variant={statusVariant(task.orderStatus)}>{formatStatus(task.orderStatus)}</StatusBadge>
                <StatusBadge variant={statusVariant(task.assignmentStatus)}>{formatStatus(task.assignmentStatus)}</StatusBadge>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <DetailItem label="Receiver Name" value={task.receiverName} />
              <DetailItem label="Receiver Phone" value={task.receiverPhone} />
              <DetailItem label="Receiver Address" value={task.receiverAddress} />
              <DetailItem label="Drop-off Address" value={task.dropoffAddress} />
              <DetailItem label="Sender" value={`${task.senderName || '-'} - ${task.senderPhone || '-'}`} />
              <DetailItem label="Pickup Address" value={task.pickupAddress} />
              <DetailItem label="Parcel Description" value={task.parcelDescription} />
              <DetailItem label="Parcel Weight" value={`${task.parcelWeightKg || 0} kg`} />
              <DetailItem label="Total Amount" value={formatMoney(task.totalAmount)} />
              <DetailItem label="Advance Amount" value={formatMoney(task.advanceAmount)} />
              <DetailItem label="Balance to Collect" value={formatMoney(task.balanceAmount)} />
              <DetailItem label="Accepted At" value={formatDateTime(task.acceptedAt)} />
              <DetailItem label="Reached Destination At" value={formatDateTime(task.deliveryConfirmation?.reachedDestinationAt)} />
              <DetailItem label="Delivered At" value={formatDateTime(task.deliveryConfirmation?.deliveredAt)} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/driver/deliveries">
                <SecondaryButton>Back to Assigned Deliveries</SecondaryButton>
              </Link>
              {action && <PrimaryButton onClick={openActionModal}>{action.label}</PrimaryButton>}
            </div>
          </section>

          <section className="pg-panel p-5">
            <h2 className="text-lg font-bold text-[#F8FAFC]">Status Timeline</h2>
            <div className="mt-5 space-y-4">
              {(task.timeline || []).map((item) => (
                <div key={item.id} className="rounded-lg border border-[#263247] bg-[#111827] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge variant={statusVariant(item.newStatus)}>{formatStatus(item.newStatus)}</StatusBadge>
                    <span className="text-xs text-[#64748B]">{formatDateTime(item.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#CBD5E1]">{item.note || 'Status updated.'}</p>
                  <p className="mt-1 text-xs text-[#64748B]">By {item.changedBy}</p>
                </div>
              ))}
              {(task.timeline || []).length === 0 && <p className="text-sm text-[#94A3B8]">No timeline entries yet.</p>}
            </div>
          </section>
        </div>
      )}

      <Modal open={modalOpen} title={action?.label || 'Delivery Action'} description={task ? `Confirm action for ${task.trackingNumber}.` : ''} onClose={() => setModalOpen(false)}>
        {action?.key === 'complete' ? (
          <div className="grid gap-4">
            <p className="rounded-md border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-4 py-3 text-sm text-[#FCD34D]">
              Expected balance to collect: {formatMoney(task?.balanceAmount)}
            </p>
            <label className="block">
              <span className="pg-label">Recipient Name</span>
              <input className="pg-field mt-2" value={completion.recipientName} onChange={(event) => setCompletion((current) => ({ ...current, recipientName: event.target.value }))} />
            </label>
            <label className="block">
              <span className="pg-label">Balance Collected Amount</span>
              <input type="number" step="0.01" className="pg-field mt-2" value={completion.balanceCollectedAmount} onChange={(event) => setCompletion((current) => ({ ...current, balanceCollectedAmount: event.target.value }))} />
            </label>
            <label className="block">
              <span className="pg-label">Delivery Notes</span>
              <textarea className="pg-field mt-2 min-h-24" value={completion.deliveryNotes} onChange={(event) => setCompletion((current) => ({ ...current, deliveryNotes: event.target.value }))} />
            </label>
            <label className="block">
              <span className="pg-label">Proof Image Path (optional)</span>
              <input className="pg-field mt-2" value={completion.proofImagePath} onChange={(event) => setCompletion((current) => ({ ...current, proofImagePath: event.target.value }))} placeholder="Optional local proof image path" />
            </label>
          </div>
        ) : (
          <label className="block">
            <span className="pg-label">Action Note</span>
            <textarea className="pg-field mt-2 min-h-24" value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <SecondaryButton onClick={() => setModalOpen(false)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={submitAction} disabled={processing}>{processing ? 'Processing...' : 'Confirm Action'}</PrimaryButton>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default DeliveryTaskDetailPage;
