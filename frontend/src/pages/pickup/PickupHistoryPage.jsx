import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPickupHistory } from '../../api/pickupApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatStatus, statusVariant } from '../../utils/formatters.js';

function PickupHistoryPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);
      setError('');
      const data = await getPickupHistory();
      setTasks(data || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: 'trackingNumber', header: 'Tracking Number', render: (task) => <span className="font-bold text-[#F8FAFC]">{task.trackingNumber}</span> },
    { key: 'senderName', header: 'Sender' },
    { key: 'receiverName', header: 'Receiver' },
    { key: 'orderStatus', header: 'Picked Up / Reached Status', render: (task) => <StatusBadge variant={statusVariant(task.orderStatus)}>{formatStatus(task.orderStatus)}</StatusBadge> },
    { key: 'completedAt', header: 'Completed At', render: (task) => formatDateTime(task.completedAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (task) => (
        <Link to={`/pickup/tasks/${task.assignmentId}`}>
          <SecondaryButton className="px-3 py-1.5 text-xs">View Details</SecondaryButton>
        </Link>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Pickup Agent"
        title="Pickup History"
        description="Completed pickup assignments that have reached the warehouse for processing."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={tasks.map((task) => ({ ...task, key: task.assignmentId }))} loading={loading} emptyMessage="No completed pickup tasks yet." />
      </section>
    </DashboardLayout>
  );
}

export default PickupHistoryPage;
