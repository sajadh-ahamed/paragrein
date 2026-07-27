import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerOrders } from '../../api/customerOrderApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatMoney, formatStatus, statusVariant } from '../../utils/formatters.js';

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await getCustomerOrders();
      setOrders(data || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: 'trackingNumber', header: 'Tracking', render: (order) => <span className="font-bold text-[#F8FAFC]">{order.trackingNumber}</span> },
    { key: 'receiverName', header: 'Receiver' },
    { key: 'orderStatus', header: 'Order Status', render: (order) => <StatusBadge variant={statusVariant(order.orderStatus)}>{formatStatus(order.orderStatus)}</StatusBadge> },
    { key: 'financialStatus', header: 'Financial', render: (order) => <StatusBadge variant={statusVariant(order.financialStatus)}>{formatStatus(order.financialStatus)}</StatusBadge> },
    { key: 'totalAmount', header: 'Total', render: (order) => <span className="font-bold text-[#86EFAC]">{formatMoney(order.totalAmount)}</span> },
    { key: 'createdAt', header: 'Created', render: (order) => formatDateTime(order.createdAt) },
    {
      key: 'actions',
      header: 'Action',
      render: (order) => <Link to={`/customer/orders/${order.id}`}><SecondaryButton className="px-3 py-1.5 text-xs">View Details</SecondaryButton></Link>,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Customer"
        title="My Orders"
        description="Review your parcel delivery requests, payment status, and current workflow state."
        actions={<Link to="/customer/create-order"><PrimaryButton>New Order</PrimaryButton></Link>}
      />

      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={orders} loading={loading} emptyMessage="You have not created any orders yet." />
      </section>
    </DashboardLayout>
  );
}

export default MyOrdersPage;
