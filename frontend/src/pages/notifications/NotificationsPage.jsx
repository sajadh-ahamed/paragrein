import { useEffect, useState } from 'react';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../../api/notificationApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatProductMessage, formatStatus, statusVariant } from '../../utils/formatters.js';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      setNotifications(await getNotifications());
      setError('');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id) {
    await markNotificationAsRead(id);
    await loadNotifications();
  }

  async function markAllRead() {
    await markAllNotificationsAsRead();
    await loadNotifications();
  }

  const columns = [
    { key: 'title', header: 'Title', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.title}</span> },
    { key: 'message', header: 'Message', render: (row) => formatProductMessage(row.message) },
    { key: 'notificationType', header: 'Type', render: (row) => formatStatus(row.notificationType) },
    { key: 'readStatus', header: 'Status', render: (row) => <StatusBadge variant={statusVariant(row.readStatus)}>{formatStatus(row.readStatus)}</StatusBadge> },
    { key: 'createdAt', header: 'Created', render: (row) => formatDateTime(row.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => row.readStatus === 'UNREAD'
        ? <button type="button" onClick={() => markRead(row.id)} className="font-semibold text-[#22C55E] hover:underline">Mark read</button>
        : <span className="text-[#64748B]">Read</span>,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Notification Center"
        title="System Notifications"
        description="Workflow, payment, assignment, delivery, and issue updates for your account."
        actions={<PrimaryButton onClick={markAllRead}>Mark All Read</PrimaryButton>}
      />
      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={notifications} loading={loading} emptyMessage="No notifications available." />
      </section>
    </DashboardLayout>
  );
}

export default NotificationsPage;
