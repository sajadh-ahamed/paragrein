import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthData } from '../utils/authStorage.js';
import NotificationBell from './NotificationBell.jsx';
import ReportIssueModal from './ReportIssueModal.jsx';
import SecondaryButton from './SecondaryButton.jsx';
import StatusBadge from './StatusBadge.jsx';

function formatRole(role) {
  return role ? role.replaceAll('_', ' ') : 'User';
}

function Topbar({ user, onMenuClick }) {
  const navigate = useNavigate();
  const [issueModalOpen, setIssueModalOpen] = useState(false);

  function logout() {
    clearAuthData();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-[#263247] bg-[#070B14]/90 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md border border-[#263247] bg-[#111827] px-3 py-2 text-sm font-semibold text-[#F8FAFC] lg:hidden"
        >
          Menu
        </button>
        <div>
          <p className="text-sm text-[#94A3B8]">Hello {user?.username || 'user'}</p>
          <p className="text-xs text-[#64748B]">{user?.fullName || 'Paragrein user'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge variant="active">{formatRole(user?.role)}</StatusBadge>
        <Link
          to="/issues/my"
          className="hidden rounded-md border border-[#263247] bg-[#111827] px-3 py-2 text-sm font-semibold text-[#CBD5E1] transition hover:border-[#22C55E]/60 hover:bg-[#1B2233] xl:inline-flex"
        >
          My Issues
        </Link>
        <button
          type="button"
          onClick={() => setIssueModalOpen(true)}
          className="hidden rounded-md border border-[#263247] bg-[#111827] px-3 py-2 text-sm font-semibold text-[#CBD5E1] transition hover:border-[#22C55E]/60 hover:bg-[#1B2233] md:inline-flex"
        >
          Report Issue
        </button>
        <NotificationBell />
        <SecondaryButton onClick={logout} className="px-3 py-2">
          Logout
        </SecondaryButton>
      </div>
      <ReportIssueModal open={issueModalOpen} onClose={() => setIssueModalOpen(false)} />
    </header>
  );
}

export default Topbar;
