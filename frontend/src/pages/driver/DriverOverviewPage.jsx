import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAssignedDeliveries, getDriverDashboardSummary } from '../../api/driverApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatMoney, formatStatus, statusVariant } from '../../utils/formatters.js';

function DriverOverviewPage() {
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    try {
      setLoading(true);
      setError('');
      const [summaryData, taskData] = await Promise.all([
        getDriverDashboardSummary(),
        getAssignedDeliveries(),
      ]);
      setSummary(summaryData);
      setTasks(taskData || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: 'trackingNumber', header: 'Tracking Number', render: (task) => <span className="font-bold text-[#F8FAFC]">{task.trackingNumber}</span> },
    { key: 'receiverName', header: 'Receiver' },
    { key: 'dropoffAddress', header: 'Drop-off Address' },
    { key: 'balanceAmount', header: 'Balance', render: (task) => <span className="font-semibold text-[#FCD34D]">{formatMoney(task.balanceAmount)}</span> },
    { key: 'orderStatus', header: 'Order Status', render: (task) => <StatusBadge variant={statusVariant(task.orderStatus)}>{formatStatus(task.orderStatus)}</StatusBadge> },
    { key: 'assignedAt', header: 'Assigned At', render: (task) => formatDateTime(task.assignedAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (task) => (
        <Link to={`/driver/deliveries/${task.assignmentId}`}>
          <PrimaryButton className="px-3 py-1.5 text-xs">View Task</PrimaryButton>
        </Link>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Driver"
        title="Driver Overview"
        description="Accept delivery assignments, reach destination, collect balance, and complete delivery."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Assigned Deliveries" value={summary?.assignedDeliveriesCount ?? 0} hint="Waiting for acceptance" tone="amber" />
        <StatCard label="Accepted Deliveries" value={summary?.acceptedDeliveriesCount ?? 0} hint="Accepted and en route" />
        <StatCard label="Reached Destination" value={summary?.reachedDestinationCount ?? 0} hint="Balance collection pending" tone="blue" />
        <StatCard label="Completed Deliveries" value={summary?.completedDeliveriesCount ?? 0} hint="Delivered and settled" />
        <StatCard label="Balance to Collect" value={formatMoney(summary?.totalBalanceToCollect)} hint="Current destination tasks" tone="amber" />
        <StatCard label="Availability" value={formatStatus(summary?.currentAvailabilityStatus)} hint="Updated after delivery" tone="blue" />
      </section>

      <section className="pg-panel mt-6 p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#F8FAFC]">Active Delivery Tasks</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">Current delivery assignments for your driver account.</p>
          </div>
          <Link to="/driver/deliveries">
            <PrimaryButton>Open Assigned Deliveries</PrimaryButton>
          </Link>
        </div>
        <DataTable columns={columns} data={tasks.map((task) => ({ ...task, key: task.assignmentId }))} loading={loading} emptyMessage="No active delivery tasks assigned." />
      </section>
    </DashboardLayout>
  );
}

export default DriverOverviewPage;
