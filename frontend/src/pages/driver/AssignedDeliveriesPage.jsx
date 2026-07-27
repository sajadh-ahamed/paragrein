import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { acceptDelivery, completeDelivery, getAssignedDeliveries, markReachedDestination } from '../../api/driverApi.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatMoney, formatStatus, statusVariant } from '../../utils/formatters.js';

function nextAction(task) {
  if (task.assignmentStatus === 'ASSIGNED' && task.orderStatus === 'ASSIGNED_TO_DELIVERY') {
    return { key: 'accept', label: 'Accept Delivery', note: 'Delivery task accepted by driver.' };
  }
  if (task.assignmentStatus === 'ACCEPTED' && task.orderStatus === 'DELIVERY_ACCEPTED') {
    return { key: 'destination', label: 'Mark Reached Destination', note: 'Driver reached destination.' };
  }
  if (task.assignmentStatus === 'ACCEPTED' && task.orderStatus === 'REACHED_DESTINATION') {
    return { key: 'complete', label: 'Complete Delivery' };
  }
  return null;
}

function AssignedDeliveriesPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [note, setNote] = useState('');
  const [completion, setCompletion] = useState({ recipientName: '', balanceCollectedAmount: '', deliveryNotes: '', proofImagePath: '' });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError('');
      const data = await getAssignedDeliveries();
      setTasks(data || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  function openAction(task) {
    const action = nextAction(task);
    setSelectedTask(task);
    setNote(action?.note || '');
    setCompletion({
      recipientName: task.receiverName || '',
      balanceCollectedAmount: task.balanceAmount || '',
      deliveryNotes: 'Delivered successfully.',
      proofImagePath: '',
    });
    setError('');
    setSuccess('');
  }

  async function submitAction() {
    const action = nextAction(selectedTask);
    if (!action) {
      setError('No valid next action is available for this delivery task.');
      return;
    }
    if (action.key === 'complete' && (!completion.recipientName || !completion.balanceCollectedAmount)) {
      setError('Recipient name and balance collected amount are required.');
      return;
    }
    if (action.key === 'complete' && Number(completion.balanceCollectedAmount) !== Number(selectedTask.balanceAmount)) {
      setError(`Collected balance must match ${formatMoney(selectedTask.balanceAmount)}.`);
      return;
    }

    try {
      setProcessing(true);
      if (action.key === 'accept') {
        await acceptDelivery(selectedTask.assignmentId, note);
      } else if (action.key === 'destination') {
        await markReachedDestination(selectedTask.assignmentId, note);
      } else {
        await completeDelivery(selectedTask.assignmentId, {
          ...completion,
          balanceCollectedAmount: Number(completion.balanceCollectedAmount),
        });
      }
      setSuccess(`${action.label} completed for ${selectedTask.trackingNumber}.`);
      setSelectedTask(null);
      await loadTasks();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setProcessing(false);
    }
  }

  const columns = [
    { key: 'trackingNumber', header: 'Tracking Number', render: (task) => <span className="font-bold text-[#F8FAFC]">{task.trackingNumber}</span> },
    { key: 'receiverName', header: 'Receiver Name' },
    { key: 'receiverPhone', header: 'Receiver Phone' },
    { key: 'receiverAddress', header: 'Receiver Address' },
    { key: 'dropoffAddress', header: 'Drop-off Address' },
    { key: 'parcelDescription', header: 'Parcel' },
    { key: 'balanceAmount', header: 'Balance', render: (task) => <span className="font-semibold text-[#FCD34D]">{formatMoney(task.balanceAmount)}</span> },
    { key: 'orderStatus', header: 'Order Status', render: (task) => <StatusBadge variant={statusVariant(task.orderStatus)}>{formatStatus(task.orderStatus)}</StatusBadge> },
    { key: 'assignmentStatus', header: 'Assignment Status', render: (task) => <StatusBadge variant={statusVariant(task.assignmentStatus)}>{formatStatus(task.assignmentStatus)}</StatusBadge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (task) => {
        const action = nextAction(task);
        return (
          <div className="flex flex-wrap gap-2">
            <Link to={`/driver/deliveries/${task.assignmentId}`}>
              <SecondaryButton className="px-3 py-1.5 text-xs">View Details</SecondaryButton>
            </Link>
            {action && <PrimaryButton onClick={() => openAction(task)} className="px-3 py-1.5 text-xs">{action.label}</PrimaryButton>}
          </div>
        );
      },
    },
  ];

  const action = selectedTask ? nextAction(selectedTask) : null;

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Driver"
        title="Assigned Deliveries"
        description="Work through the valid delivery sequence: accept, reach destination, then complete delivery with balance collection."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      {success && <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{success}</div>}

      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={tasks.map((task) => ({ ...task, key: task.assignmentId }))} loading={loading} emptyMessage="No active delivery tasks assigned." />
      </section>

      <Modal
        open={Boolean(selectedTask)}
        title={action?.label || 'Delivery Action'}
        description={selectedTask ? `Confirm action for ${selectedTask.trackingNumber}.` : ''}
        onClose={() => setSelectedTask(null)}
      >
        {action?.key === 'complete' ? (
          <div className="grid gap-4">
            <p className="rounded-md border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-4 py-3 text-sm text-[#FCD34D]">
              Expected balance to collect: {formatMoney(selectedTask?.balanceAmount)}
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
          <SecondaryButton onClick={() => setSelectedTask(null)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={submitAction} disabled={processing}>{processing ? 'Processing...' : 'Confirm Action'}</PrimaryButton>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default AssignedDeliveriesPage;
