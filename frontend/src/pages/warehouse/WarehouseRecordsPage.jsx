import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProcessingOrders, markReadyForDispatch } from '../../api/warehouseApi.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatStatus, statusVariant } from '../../utils/formatters.js';

function WarehouseRecordsPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [note, setNote] = useState('Parcel checked and ready for dispatch.');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      setLoading(true);
      setError('');
      const data = await getProcessingOrders();
      setOrders(data || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  function openReadyModal(order) {
    setSelectedOrder(order);
    setNote('Parcel checked and ready for dispatch.');
    setError('');
    setSuccess('');
  }

  async function submitReady() {
    try {
      setProcessing(true);
      await markReadyForDispatch(selectedOrder.id, note);
      setSuccess(`${selectedOrder.trackingNumber} marked ready for dispatch.`);
      setSelectedOrder(null);
      await loadRecords();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setProcessing(false);
    }
  }

  const columns = [
    { key: 'trackingNumber', header: 'Tracking Number', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
    { key: 'parcelCondition', header: 'Parcel Condition', render: (row) => row.warehouseRecord?.parcelCondition || '-' },
    { key: 'storageZone', header: 'Storage Zone', render: (row) => row.warehouseRecord?.storageZone || '-' },
    { key: 'storageRack', header: 'Storage Rack', render: (row) => row.warehouseRecord?.storageRack || '-' },
    { key: 'receivedBy', header: 'Received By', render: (row) => row.warehouseRecord?.receivedByName || row.warehouseRecord?.receivedByUsername || '-' },
    { key: 'receivedAt', header: 'Received At', render: (row) => formatDateTime(row.warehouseRecord?.receivedAt) },
    { key: 'orderStatus', header: 'Current Status', render: (row) => <StatusBadge variant={statusVariant(row.orderStatus)}>{formatStatus(row.orderStatus)}</StatusBadge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link to={`/warehouse/orders/${row.id}`}>
            <SecondaryButton className="px-3 py-1.5 text-xs">View Details</SecondaryButton>
          </Link>
          <PrimaryButton onClick={() => openReadyModal(row)} className="px-3 py-1.5 text-xs">Mark Ready</PrimaryButton>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Warehouse"
        title="Warehouse Records"
        description="Parcels currently in warehouse processing with storage details recorded."
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      {success && <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{success}</div>}

      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={orders.map((order) => ({ ...order, key: order.id }))} loading={loading} emptyMessage="No parcels are currently in warehouse processing." />
      </section>

      <Modal open={Boolean(selectedOrder)} title="Mark Ready for Dispatch" description={selectedOrder ? `Confirm dispatch readiness for ${selectedOrder.trackingNumber}.` : ''} onClose={() => setSelectedOrder(null)}>
        <p className="text-sm leading-6 text-[#94A3B8]">This moves the order to the admin driver-assignment queue.</p>
        <label className="mt-4 block">
          <span className="pg-label">Action Note</span>
          <textarea className="pg-field mt-2 min-h-24" value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <SecondaryButton onClick={() => setSelectedOrder(null)}>Cancel</SecondaryButton>
          <PrimaryButton onClick={submitReady} disabled={processing}>{processing ? 'Updating...' : 'Confirm Ready'}</PrimaryButton>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default WarehouseRecordsPage;
