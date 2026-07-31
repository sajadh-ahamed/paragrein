import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// add rejectPickupTask,
import { acceptPickupTask, getPickupTaskDetail, markParcelPickedUp, markReachedWarehouse } from '../../api/pickupApi.js';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatProductMessage, formatStatus, statusVariant } from '../../utils/formatters.js';

function nextAction(task) {
  if (task?.assignmentStatus === 'ASSIGNED' && task?.orderStatus === 'ASSIGNED_TO_PICKUP') {
    return { key: 'accept', label: 'Accept Pickup', note: 'Pickup task accepted by pickup agent.' };
  }
  if (task?.assignmentStatus === 'ACCEPTED' && task?.orderStatus === 'PICKUP_ACCEPTED') {
    return { key: 'picked-up', label: 'Mark Picked Up', note: 'Parcel picked up from sender.' };
  }
  if (task?.assignmentStatus === 'ACCEPTED' && task?.orderStatus === 'IN_TRANSIT_TO_WAREHOUSE') {
    return { key: 'warehouse', label: 'Reach Warehouse', note: 'Parcel reached warehouse.' };
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

function PickupTaskDetailPage() {
  const { assignmentId } = useParams();
  const [task, setTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [note, setNote] = useState('');
// const [rejectModalOpen, setRejectModalOpen] = useState(false);
// const [rejectReason, setRejectReason] = useState('');
const [rejectReason, setRejectReason] = useState('');
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
      const data = await getPickupTaskDetail(assignmentId);
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
    setModalOpen(true);
    setError('');
    setSuccess('');
  }

//   function openRejectModal() {
//   setRejectReason('');
//   setRejectModalOpen(true);
// }

  async function submitAction() {
    const action = nextAction(task);
    if (!action) {
      setError('No valid next action is available for this pickup task.');
      return;
    }


//     async function submitReject() {
//   if (!rejectReason.trim()) {
//     setError('Reject reason is required.');
//     return;
//   }

//   try {
//     setProcessing(true);

//     const updated = await rejectPickupTask(task.assignmentId, {
//       note: rejectReason,
//     });

//     setTask(updated);

//     setSuccess(`Pickup rejected for ${task.trackingNumber}.`);

//     setRejectModalOpen(false);
//   } catch (apiError) {
//     setError(apiError.message);
//   } finally {
//     setProcessing(false);
//   }
// }

    try {
      setProcessing(true);
      let updated;
      if (action.key === 'accept') {
        updated = await acceptPickupTask(task.assignmentId, note);
      } else if (action.key === 'picked-up') {
        updated = await markParcelPickedUp(task.assignmentId, note);
      } else {
        updated = await markReachedWarehouse(task.assignmentId, note);
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
        eyebrow="Pickup Task"
        title={task?.trackingNumber || 'Task Details'}
        description="Review sender, receiver, parcel, timing, and status timeline before moving the task forward."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      {success && <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{success}</div>}

      {loading && <div className="pg-panel mt-6 p-6 text-sm text-[#94A3B8]">Loading pickup task...</div>}

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
              <DetailItem label="Sender Name" value={task.senderName} />
              <DetailItem label="Sender Phone" value={task.senderPhone} />
              <DetailItem label="Sender Address" value={task.senderAddress} />
              <DetailItem label="Pickup Address" value={task.pickupAddress} />
              <DetailItem label="Receiver Name" value={task.receiverName} />
              <DetailItem label="Receiver Phone" value={task.receiverPhone} />
              <DetailItem label="Receiver Address" value={task.receiverAddress} />
              <DetailItem label="Drop-off Address" value={task.dropoffAddress} />
              <DetailItem label="Parcel Description" value={task.parcelDescription} />
              <DetailItem label="Parcel Weight" value={`${task.parcelWeightKg || 0} kg`} />
              <DetailItem label="Accepted At" value={formatDateTime(task.acceptedAt)} />
              <DetailItem label="Completed At" value={formatDateTime(task.completedAt)} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/pickup/tasks">
                <SecondaryButton>Back to Assigned Pickups</SecondaryButton>
              </Link>
              {action && <PrimaryButton onClick={openActionModal}>{action.label}</PrimaryButton>}
            </div>

{/*change above div tag completely
 <div className="mt-6 flex flex-wrap gap-3">
  <Link to="/pickup/tasks">
    <SecondaryButton>
      Back to Assigned Pickups
    </SecondaryButton>
  </Link>

  {action && (
    <PrimaryButton onClick={openActionModal}>
      {action.label}
    </PrimaryButton>
  )}

  {task?.assignmentStatus === 'ASSIGNED' && (
    <SecondaryButton onClick={openRejectModal}>
      Reject
    </SecondaryButton>
  )}
</div> */}

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

      <Modal open={modalOpen} title={action?.label || 'Pickup Action'} description={task ? `Confirm action for ${task.trackingNumber}.` : ''} onClose={() => setModalOpen(false)}>
        <label className="block">
          <span className="pg-label">Action Note</span>
          <textarea className="pg-field mt-2 min-h-24" value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <SecondaryButton onClick={() => setModalOpen(false)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={submitAction} disabled={processing}>{processing ? 'Processing...' : 'Confirm Action'}</PrimaryButton>
        </div>
      </Modal>

{/* <Modal
  open={rejectModalOpen}
  title="Reject Pickup Assignment"
  description="Provide the reason for rejecting this assignment."
  onClose={() => setRejectModalOpen(false)}
>
  <label className="block">
    <span className="pg-label">Reject Reason</span>

    <textarea
      className="pg-field mt-2 min-h-24"
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
    />
  </label>

  <div className="mt-5 flex justify-end gap-3">
    <SecondaryButton onClick={() => setRejectModalOpen(false)}>
      Cancel
    </SecondaryButton>

    <PrimaryButton
      onClick={submitReject}
      disabled={processing}
    >
      {processing ? 'Rejecting...' : 'Confirm Reject'}
    </PrimaryButton>
  </div>
</Modal> */}

    </DashboardLayout>
  );
}

export default PickupTaskDetailPage;
