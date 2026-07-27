import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getRecentNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../api/notificationApi.js';
import { formatDateTime, formatProductMessage, formatStatus, statusVariant } from '../utils/formatters.js';
import StatusBadge from './StatusBadge.jsx';

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const [recent, count] = await Promise.all([
        getRecentNotifications(),
        getUnreadNotificationCount(),
      ]);
      setNotifications(recent || []);
      setUnreadCount(count?.unreadCount || 0);
      setError('');
    } catch (apiError) {
      setError(apiError.message);
    }
  }

  async function markRead(notificationId) {
    try {
      await markNotificationAsRead(notificationId);
      await loadNotifications();
    } catch (apiError) {
      setError(apiError.message);
    }
  }

  async function markAllRead() {
    try {
      await markAllNotificationsAsRead();
      await loadNotifications();
    } catch (apiError) {
      setError(apiError.message);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative rounded-md border border-[#263247] bg-[#111827] px-3 py-2 text-sm font-semibold text-[#CBD5E1] transition hover:border-[#22C55E]/60 hover:bg-[#1B2233]"
      >
        Alerts
        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#22C55E] px-1 text-[10px] font-black text-[#07110B]">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[min(92vw,24rem)] rounded-lg border border-[#263247] bg-[#151B2B] p-4 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-[#F8FAFC]">Notifications</h3>
              <p className="text-xs text-[#94A3B8]">{unreadCount} unread</p>
            </div>
            <button type="button" onClick={markAllRead} className="text-xs font-semibold text-[#22C55E] hover:underline">
              Mark all read
            </button>
          </div>

          {error && <p className="mt-3 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-3 py-2 text-xs text-[#FCA5A5]">{error}</p>}

          <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
            {notifications.map((notification) => (
              <article key={notification.id} className="rounded-md border border-[#263247] bg-[#111827] p-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">{notification.title}</h4>
                  <StatusBadge variant={statusVariant(notification.readStatus)}>{formatStatus(notification.readStatus)}</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-[#CBD5E1]">{formatProductMessage(notification.message)}</p>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#94A3B8]">
                  <span>{formatDateTime(notification.createdAt)}</span>
                  {notification.readStatus === 'UNREAD' && (
                    <button type="button" onClick={() => markRead(notification.id)} className="font-semibold text-[#22C55E] hover:underline">
                      Mark read
                    </button>
                  )}
                </div>
              </article>
            ))}
            {notifications.length === 0 && <p className="rounded-md border border-[#263247] bg-[#111827] p-4 text-sm text-[#94A3B8]">No notifications available.</p>}
          </div>

          <Link to="/notifications" onClick={() => setOpen(false)} className="mt-4 block rounded-md border border-[#263247] bg-[#0B1220] px-3 py-2 text-center text-sm font-semibold text-[#CBD5E1] hover:border-[#22C55E]/60">
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
