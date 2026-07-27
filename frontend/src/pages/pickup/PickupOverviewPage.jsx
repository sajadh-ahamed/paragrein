import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAssignedPickupTasks, getPickupDashboardSummary } from '../../api/pickupApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatStatus, statusVariant } from '../../utils/formatters.js';

function PickupOverviewPage() {
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
        getPickupDashboardSummary(),
        getAssignedPickupTasks(),
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
    { key: 'senderName', header: 'Sender' },
    { key: 'pickupAddress', header: 'Pickup Address' },
    { key: 'orderStatus', header: 'Order Status', render: (task) => <StatusBadge variant={statusVariant(task.orderStatus)}>{formatStatus(task.orderStatus)}</StatusBadge> },
    { key: 'assignedAt', header: 'Assigned At', render: (task) => formatDateTime(task.assignedAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (task) => (
        <Link to={`/pickup/tasks/${task.assignmentId}`}>
          <PrimaryButton className="px-3 py-1.5 text-xs">View Task</PrimaryButton>
        </Link>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Pickup Agent"
        title="Pickup Overview"
        description="Accept assigned pickup tasks and move parcels from customer location to warehouse arrival."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Assigned Pickups" value={summary?.assignedPickupsCount ?? 0} hint="Waiting for acceptance" tone="amber" />
        <StatCard label="Accepted Pickups" value={summary?.acceptedPickupsCount ?? 0} hint="Accepted but not picked up" />
        <StatCard label="In Transit" value={summary?.inTransitToWarehouseCount ?? 0} hint="Moving to warehouse" tone="blue" />
        <StatCard label="Completed Pickups" value={summary?.completedPickupsCount ?? 0} hint="Reached warehouse" />
        <StatCard label="Availability" value={formatStatus(summary?.currentAvailabilityStatus)} hint="Updated after warehouse arrival" tone="blue" />
      </section>

      <section className="pg-panel mt-6 p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#F8FAFC]">Active Pickup Tasks</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">Current tasks assigned to your pickup account.</p>
          </div>
          <Link to="/pickup/tasks">
            <PrimaryButton>Open Assigned Pickups</PrimaryButton>
          </Link>
        </div>
        <DataTable columns={columns} data={tasks.map((task) => ({ ...task, key: task.assignmentId }))} loading={loading} emptyMessage="No active pickup tasks assigned." />
      </section>
    </DashboardLayout>
  );
}

export default PickupOverviewPage;
