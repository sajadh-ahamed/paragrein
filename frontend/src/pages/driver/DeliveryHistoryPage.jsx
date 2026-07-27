import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDeliveryHistory } from '../../api/driverApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatMoney, formatStatus, statusVariant } from '../../utils/formatters.js';

function DeliveryHistoryPage() {
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
      const data = await getDeliveryHistory();
      setTasks(data || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: 'trackingNumber', header: 'Tracking Number', render: (task) => <span className="font-bold text-[#F8FAFC]">{task.trackingNumber}</span> },
    { key: 'receiverName', header: 'Receiver' },
    { key: 'balanceCollectedAmount', header: 'Balance Collected', render: (task) => <span className="font-semibold text-[#86EFAC]">{formatMoney(task.balanceCollectedAmount)}</span> },
    { key: 'deliveredAt', header: 'Delivered At', render: (task) => formatDateTime(task.deliveredAt) },
    { key: 'assignmentStatus', header: 'Assignment Status', render: (task) => <StatusBadge variant={statusVariant(task.assignmentStatus)}>{formatStatus(task.assignmentStatus)}</StatusBadge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (task) => (
        <Link to={`/driver/deliveries/${task.assignmentId}`}>
          <SecondaryButton className="px-3 py-1.5 text-xs">View Details</SecondaryButton>
        </Link>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Driver"
        title="Delivery History"
        description="Completed delivery assignments with balance collection and delivered timestamps."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={tasks.map((task) => ({ ...task, key: task.assignmentId }))} loading={loading} emptyMessage="No completed delivery tasks yet." />
      </section>
    </DashboardLayout>
  );
}

export default DeliveryHistoryPage;
