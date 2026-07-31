import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//,rejectPickupTask  add this below
import { acceptPickupTask, getAssignedPickupTasks, markParcelPickedUp, markReachedWarehouse } from '../../api/pickupApi.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatStatus, statusVariant } from '../../utils/formatters.js';

function nextAction(task) {
  if (task.assignmentStatus === 'ASSIGNED' && task.orderStatus === 'ASSIGNED_TO_PICKUP') {
    return { key: 'accept', label: 'Accept', note: 'Pickup task accepted by pickup agent.' };
  }
  if (task.assignmentStatus === 'ACCEPTED' && task.orderStatus === 'PICKUP_ACCEPTED') {
    return { key: 'picked-up', label: 'Mark Picked Up', note: 'Parcel picked up from sender.' };
  }
  if (task.assignmentStatus === 'ACCEPTED' && task.orderStatus === 'IN_TRANSIT_TO_WAREHOUSE') {
    return { key: 'warehouse', label: 'Reach Warehouse', note: 'Parcel reached warehouse.' };
  }
  return null;
}

function AssignedPickupsPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
//   const [rejectModalOpen, setRejectModalOpen] = useState(false);
// const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError('');
      const data = await getAssignedPickupTasks();
      setTasks(data || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

//   function openRejectModal(task) {
//     setSelectedTask(task);
//     setRejectReason('');
//     setRejectModalOpen(true);
// }

// async function submitReject() {

//     if (!rejectReason.trim()) {
//         setError("Rejection reason is required.");
//         return;
//     }

//     try {

//         setProcessing(true);

//         await rejectPickupTask(
//                 selectedTask.assignmentId,
//                 rejectReason);

//         setRejectModalOpen(false);

//         setSelectedTask(null);

//         setSuccess("Pickup assignment rejected.");

//         await loadTasks();

//     } catch (apiError) {

//         setError(apiError.message);

//     } finally {

//         setProcessing(false);

//     }

// }

  function openAction(task) {
    const action = nextAction(task);
    setSelectedTask(task);
    setNote(action?.note || '');
    setError('');
    setSuccess('');
  }

  async function submitAction() {
    const action = nextAction(selectedTask);
    if (!action) {
      setError('No valid next action is available for this pickup task.');
      return;
    }

    try {
      setProcessing(true);
      if (action.key === 'accept') {
        await acceptPickupTask(selectedTask.assignmentId, note);
      } else if (action.key === 'picked-up') {
        await markParcelPickedUp(selectedTask.assignmentId, note);
      } else {
        await markReachedWarehouse(selectedTask.assignmentId, note);
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
    { key: 'senderName', header: 'Sender Name' },
    { key: 'senderPhone', header: 'Sender Phone' },
    { key: 'pickupAddress', header: 'Pickup Address' },
    { key: 'receiverName', header: 'Receiver Name' },
    { key: 'dropoffAddress', header: 'Drop-off Address' },
    { key: 'parcelDescription', header: 'Parcel Description' },
    { key: 'orderStatus', header: 'Order Status', render: (task) => <StatusBadge variant={statusVariant(task.orderStatus)}>{formatStatus(task.orderStatus)}</StatusBadge> },
    { key: 'assignmentStatus', header: 'Assignment Status', render: (task) => <StatusBadge variant={statusVariant(task.assignmentStatus)}>{formatStatus(task.assignmentStatus)}</StatusBadge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (task) => {
        const action = nextAction(task);
        return (
          <div className="flex flex-wrap gap-2">
            <Link to={`/pickup/tasks/${task.assignmentId}`}>
              <SecondaryButton className="px-3 py-1.5 text-xs">View Details</SecondaryButton>
            </Link>
            {action && <PrimaryButton onClick={() => openAction(task)} className="px-3 py-1.5 text-xs">{action.label}</PrimaryButton>}
          </div>
        );
      },
    },
  ];

  //above chnage this part only 
/*render: (task) => {
    const action = nextAction(task);

    return (
        <div className="flex flex-wrap gap-2">

            <Link to={`/pickup/tasks/${task.assignmentId}`}>
                <SecondaryButton className="px-3 py-1.5 text-xs">
                    View Details
                </SecondaryButton>
            </Link>

            {action && (
                <>
                    <PrimaryButton
                        onClick={() => openAction(task)}
                        className="px-3 py-1.5 text-xs"
                    >
                        {action.label}
                    </PrimaryButton>

                    {task.assignmentStatus === "ASSIGNED" && (
                        <SecondaryButton
                            onClick={() => openRejectModal(task)}
                            className="px-3 py-1.5 text-xs"
                        >
                            Reject
                        </SecondaryButton>
                    )}
                </>
            )}

        </div>
    );
}*/

  const action = selectedTask ? nextAction(selectedTask) : null;

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Pickup Agent"
        title="Assigned Pickups"
        description="Work through the valid pickup sequence: accept, mark picked up, then reach warehouse."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      {success && <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{success}</div>}

      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={tasks.map((task) => ({ ...task, key: task.assignmentId }))} loading={loading} emptyMessage="No active pickup tasks assigned." />
      </section>

      <Modal
        open={Boolean(selectedTask)}
        title={action ? action.label : 'Pickup Action'}
        description={selectedTask ? `Confirm action for ${selectedTask.trackingNumber}.` : ''}
        onClose={() => setSelectedTask(null)}
      >
        <label className="block">
          <span className="pg-label">Action Note</span>
          <textarea className="pg-field mt-2 min-h-24" value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <SecondaryButton onClick={() => setSelectedTask(null)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={submitAction} disabled={processing}>{processing ? 'Processing...' : 'Confirm Action'}</PrimaryButton>
        </div>
      </Modal>
      {/* <Modal
    open={rejectModalOpen}
    title="Reject Pickup Assignment"
    description="Please enter the rejection reason."
    onClose={() => setRejectModalOpen(false)}
>

<textarea
    className="pg-field mt-2 min-h-24"
    value={rejectReason}
    onChange={(e)=>setRejectReason(e.target.value)}
/>

<div className="mt-5 flex justify-end gap-3">

<SecondaryButton
onClick={()=>setRejectModalOpen(false)}>
Cancel
</SecondaryButton>

<PrimaryButton
onClick={submitReject}>
Reject Assignment
</PrimaryButton>

</div>

</Modal> */}
    </DashboardLayout>
  );
}

export default AssignedPickupsPage;
