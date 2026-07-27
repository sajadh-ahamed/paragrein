import { useEffect, useState } from 'react';
import { getAuditLogs } from '../../api/auditLogApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatStatus } from '../../utils/formatters.js';

const initialFilters = {
  action: '',
  entityType: '',
  username: '',
};

function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs(nextFilters = filters) {
    try {
      setLoading(true);
      setLogs(await getAuditLogs(nextFilters));
      setError('');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function clearFilters() {
    setFilters(initialFilters);
    loadLogs(initialFilters);
  }

  const columns = [
    { key: 'action', header: 'Action', render: (row) => <span className="font-bold text-[#F8FAFC]">{formatStatus(row.action)}</span> },
    { key: 'username', header: 'User', render: (row) => `${row.fullName} (${row.username})` },
    { key: 'entityType', header: 'Entity' },
    { key: 'entityId', header: 'Entity ID', render: (row) => row.entityId || '-' },
    { key: 'description', header: 'Description' },
    { key: 'createdAt', header: 'Created', render: (row) => formatDateTime(row.createdAt) },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin Audit"
        title="Audit Logs"
        description="View-only activity trail for authentication, workflow changes, employee management, settings, and issues."
      />
      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      <section className="pg-panel mt-6 p-5">
        <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto_auto]">
          <input name="action" value={filters.action} onChange={updateFilter} className="pg-field" placeholder="Filter action" />
          <input name="entityType" value={filters.entityType} onChange={updateFilter} className="pg-field" placeholder="Filter entity type" />
          <input name="username" value={filters.username} onChange={updateFilter} className="pg-field" placeholder="Filter username/name" />
          <PrimaryButton onClick={() => loadLogs()}>Apply</PrimaryButton>
          <SecondaryButton onClick={clearFilters}>Clear</SecondaryButton>
        </div>
        <DataTable columns={columns} data={logs} loading={loading} emptyMessage="No audit logs found." />
      </section>
    </DashboardLayout>
  );
}

export default AuditLogsPage;
