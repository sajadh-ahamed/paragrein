import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReadyForDispatchOrders } from '../../api/warehouseApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatStatus, statusVariant } from '../../utils/formatters.js';

function ReadyForDispatchPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError('');
      const data = await getReadyForDispatchOrders();
      setOrders(data || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: 'trackingNumber', header: 'Tracking Number', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
    { key: 'receiverName', header: 'Receiver' },
    { key: 'dropoffAddress', header: 'Drop-off Address' },
    { key: 'storageZone', header: 'Storage Zone', render: (row) => row.warehouseRecord?.storageZone || '-' },
    { key: 'readyForDispatchAt', header: 'Ready At', render: (row) => formatDateTime(row.warehouseRecord?.readyForDispatchAt) },
    { key: 'orderStatus', header: 'Status', render: (row) => <StatusBadge variant={statusVariant(row.orderStatus)}>{formatStatus(row.orderStatus)}</StatusBadge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Link to={`/warehouse/orders/${row.id}`}>
          <SecondaryButton className="px-3 py-1.5 text-xs">View Details</SecondaryButton>
        </Link>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Warehouse"
        title="Ready for Dispatch"
        description="View-only list of parcels ready for admin driver assignment."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">
        Admin users can assign available drivers from the operations dashboard.
      </div>

      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={orders.map((order) => ({ ...order, key: order.id }))} loading={loading} emptyMessage="No parcels are ready for dispatch yet." />
      </section>
    </DashboardLayout>
  );
}

export default ReadyForDispatchPage;
