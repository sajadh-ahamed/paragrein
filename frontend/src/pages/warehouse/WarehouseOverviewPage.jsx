import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArrivalQueue, getWarehouseDashboardSummary } from '../../api/warehouseApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatStatus, statusVariant } from '../../utils/formatters.js';

function WarehouseOverviewPage() {
  const [summary, setSummary] = useState(null);
  const [arrivalQueue, setArrivalQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    try {
      setLoading(true);
      setError('');
      const [summaryData, queueData] = await Promise.all([
        getWarehouseDashboardSummary(),
        getArrivalQueue(),
      ]);
      setSummary(summaryData);
      setArrivalQueue(queueData || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: 'trackingNumber', header: 'Tracking Number', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'senderName', header: 'Sender' },
    { key: 'receiverName', header: 'Receiver' },
    { key: 'orderStatus', header: 'Status', render: (row) => <StatusBadge variant={statusVariant(row.orderStatus)}>{formatStatus(row.orderStatus)}</StatusBadge> },
    { key: 'updatedAt', header: 'Updated', render: (row) => formatDateTime(row.updatedAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Link to={`/warehouse/orders/${row.id}`}>
          <PrimaryButton className="px-3 py-1.5 text-xs">View Details</PrimaryButton>
        </Link>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Warehouse Staff"
        title="Warehouse Overview"
        description="Confirm arrivals, process parcels, and prepare completed warehouse records for driver assignment."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Arrival Queue" value={summary?.arrivalQueueCount ?? 0} hint="Waiting for confirmation" tone="amber" />
        <StatCard label="Processing" value={summary?.processingCount ?? 0} hint="Warehouse records active" tone="blue" />
        <StatCard label="Ready for Dispatch" value={summary?.readyForDispatchCount ?? 0} hint="Waiting for admin driver assignment" />
        <StatCard label="Completed Records" value={summary?.completedWarehouseRecordsCount ?? 0} hint="Warehouse processing completed" />
        <StatCard label="Staff Status" value={formatStatus(summary?.currentStaffStatus)} hint="Employee availability" tone="blue" />
      </section>

      <section className="pg-panel mt-6 p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#F8FAFC]">Latest Arrival Queue</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">Parcels that pickup agents have marked as reached warehouse.</p>
          </div>
          <Link to="/warehouse/arrival-queue">
            <PrimaryButton>Open Arrival Queue</PrimaryButton>
          </Link>
        </div>
        <DataTable columns={columns} data={arrivalQueue.map((row) => ({ ...row, key: row.id }))} loading={loading} emptyMessage="No parcels waiting for warehouse confirmation." />
      </section>
    </DashboardLayout>
  );
}

export default WarehouseOverviewPage;
