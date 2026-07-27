import { useEffect, useMemo, useState } from 'react';
import { closeIssue, getAdminIssues, respondToIssue, updateIssueStatus } from '../../api/issueApi.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatStatus, statusVariant } from '../../utils/formatters.js';

function IssueReportsPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadIssues();
  }, []);

  async function loadIssues() {
    try {
      setLoading(true);
      setIssues(await getAdminIssues());
      setError('');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  function openIssue(issue) {
    setSelectedIssue(issue);
    setAdminResponse(issue.adminResponse || '');
    setNewStatus(issue.issueStatus || 'IN_PROGRESS');
  }

  async function saveResponse() {
    if (!selectedIssue) {
      return;
    }
    try {
      setSubmitting(true);
      const updated = await respondToIssue(selectedIssue.id, adminResponse);
      setSelectedIssue(updated);
      await loadIssues();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function saveStatus() {
    if (!selectedIssue) {
      return;
    }
    try {
      setSubmitting(true);
      const updated = await updateIssueStatus(selectedIssue.id, newStatus);
      setSelectedIssue(updated);
      await loadIssues();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function closeSelectedIssue() {
    if (!selectedIssue) {
      return;
    }
    try {
      setSubmitting(true);
      const updated = await closeIssue(selectedIssue.id);
      setSelectedIssue(updated);
      await loadIssues();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  const filteredIssues = useMemo(() => issues.filter((issue) => {
    const statusMatch = !statusFilter || issue.issueStatus === statusFilter;
    const severityMatch = !severityFilter || issue.severity === severityFilter;
    return statusMatch && severityMatch;
  }), [issues, statusFilter, severityFilter]);

  const columns = [
    { key: 'title', header: 'Title', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.title}</span> },
    { key: 'reporterUsername', header: 'Reporter', render: (row) => `${row.reporterName} (${row.reporterRole})` },
    { key: 'severity', header: 'Severity', render: (row) => <StatusBadge variant={statusVariant(row.severity)}>{formatStatus(row.severity)}</StatusBadge> },
    { key: 'issueStatus', header: 'Status', render: (row) => <StatusBadge variant={statusVariant(row.issueStatus)}>{formatStatus(row.issueStatus)}</StatusBadge> },
    { key: 'createdAt', header: 'Created', render: (row) => formatDateTime(row.createdAt) },
    { key: 'actions', header: 'Actions', render: (row) => <button type="button" onClick={() => openIssue(row)} className="font-semibold text-[#22C55E] hover:underline">View</button> },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin Issue Management"
        title="Issue Reports"
        description="Review user-reported issues, respond locally, and update issue status."
      />
      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      <section className="pg-panel mt-6 p-5">
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="pg-field">
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)} className="pg-field">
            <option value="">All severities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <SecondaryButton onClick={loadIssues}>Refresh</SecondaryButton>
        </div>
        <DataTable columns={columns} data={filteredIssues} loading={loading} emptyMessage="No issue reports found." />
      </section>

      <Modal open={Boolean(selectedIssue)} title="Issue Detail" description={selectedIssue?.title} onClose={() => setSelectedIssue(null)}>
        {selectedIssue && (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-[#263247] bg-[#111827] p-4">
                <p className="text-xs uppercase tracking-wide text-[#64748B]">Reporter</p>
                <p className="mt-1 font-semibold text-[#F8FAFC]">{selectedIssue.reporterName}</p>
                <p className="text-sm text-[#94A3B8]">{selectedIssue.reporterUsername} - {formatStatus(selectedIssue.reporterRole)}</p>
              </div>
              <div className="rounded-lg border border-[#263247] bg-[#111827] p-4">
                <p className="text-xs uppercase tracking-wide text-[#64748B]">Current State</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge variant={statusVariant(selectedIssue.severity)}>{formatStatus(selectedIssue.severity)}</StatusBadge>
                  <StatusBadge variant={statusVariant(selectedIssue.issueStatus)}>{formatStatus(selectedIssue.issueStatus)}</StatusBadge>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-[#263247] bg-[#111827] p-4">
              <p className="text-sm leading-relaxed text-[#CBD5E1]">{selectedIssue.description}</p>
            </div>
            <label className="block">
              <span className="pg-label">Admin Response</span>
              <textarea value={adminResponse} onChange={(event) => setAdminResponse(event.target.value)} className="pg-field mt-2 min-h-28" />
            </label>
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
              <select value={newStatus} onChange={(event) => setNewStatus(event.target.value)} className="pg-field">
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <PrimaryButton onClick={saveResponse} disabled={submitting}>Save Response</PrimaryButton>
              <SecondaryButton onClick={saveStatus} disabled={submitting}>Update Status</SecondaryButton>
              <SecondaryButton onClick={closeSelectedIssue} disabled={submitting}>Close Issue</SecondaryButton>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default IssueReportsPage;
