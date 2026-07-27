import { useEffect, useMemo, useState } from 'react';
import { getAssignmentHistory } from '../../api/adminAssignmentHistoryApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatStatus, statusVariant } from '../../utils/formatters.js';

function AssignmentHistoryPage() {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    try {
      setLoading(true);
      setAssignments(await getAssignmentHistory());
      setError('');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredAssignments = useMemo(() => assignments.filter((assignment) => {
    const text = `${assignment.trackingNumber} ${assignment.assignedToName} ${assignment.assignedToUsername} ${assignment.assignedByUsername || ''}`.toLowerCase();
    const searchMatch = !search || text.includes(search.toLowerCase());
    const typeMatch = !typeFilter || assignment.assignmentType === typeFilter;
    return searchMatch && typeMatch;
  }), [assignments, search, typeFilter]);

  const columns = [
    { key: 'trackingNumber', header: 'Tracking', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.trackingNumber}</span> },
    { key: 'assignmentType', header: 'Type', render: (row) => formatStatus(row.assignmentType) },
    { key: 'assignedToName', header: 'Assigned To', render: (row) => `${row.assignedToName} (${row.assignedToUsername})` },
    { key: 'assignedByUsername', header: 'Assigned By', render: (row) => row.assignedByUsername || 'System' },
    { key: 'assignmentStatus', header: 'Status', render: (row) => <StatusBadge variant={statusVariant(row.assignmentStatus)}>{formatStatus(row.assignmentStatus)}</StatusBadge> },
    { key: 'assignedAt', header: 'Assigned', render: (row) => formatDateTime(row.assignedAt) },
    { key: 'acceptedAt', header: 'Accepted', render: (row) => formatDateTime(row.acceptedAt) },
    { key: 'completedAt', header: 'Completed', render: (row) => formatDateTime(row.completedAt) },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin Assignment History"
        title="Pickup and Delivery Assignments"
        description="Read-only visibility for assignment creation, acceptance, and completion times."
      />
      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      <section className="pg-panel mt-6 p-5">
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_14rem_auto]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="pg-field" placeholder="Search tracking, assignee, or admin" />
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="pg-field">
            <option value="">All assignment types</option>
            <option value="PICKUP">Pickup</option>
            <option value="DELIVERY">Delivery</option>
          </select>
          <SecondaryButton onClick={loadAssignments}>Refresh</SecondaryButton>
        </div>
        <DataTable columns={columns} data={filteredAssignments} loading={loading} emptyMessage="No assignments found." />
      </section>
    </DashboardLayout>
  );
}

export default AssignmentHistoryPage;
