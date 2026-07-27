import { useEffect, useState } from 'react';
import { getMyIssues } from '../../api/issueApi.js';
import DataTable from '../../components/DataTable.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import ReportIssueModal from '../../components/ReportIssueModal.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatStatus, statusVariant } from '../../utils/formatters.js';

function MyIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadIssues();
  }, []);

  async function loadIssues() {
    try {
      setLoading(true);
      setIssues(await getMyIssues());
      setError('');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: 'title', header: 'Title', render: (row) => <span className="font-bold text-[#F8FAFC]">{row.title}</span> },
    { key: 'severity', header: 'Severity', render: (row) => <StatusBadge variant={statusVariant(row.severity)}>{formatStatus(row.severity)}</StatusBadge> },
    { key: 'issueStatus', header: 'Status', render: (row) => <StatusBadge variant={statusVariant(row.issueStatus)}>{formatStatus(row.issueStatus)}</StatusBadge> },
    { key: 'adminResponse', header: 'Admin Response', render: (row) => row.adminResponse || <span className="text-[#64748B]">Pending</span> },
    { key: 'createdAt', header: 'Created', render: (row) => formatDateTime(row.createdAt) },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Support"
        title="My Issues"
        description="Track issue reports that you have submitted to the admin team."
        actions={<PrimaryButton onClick={() => setModalOpen(true)}>Report Issue</PrimaryButton>}
      />
      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={issues} loading={loading} emptyMessage="No issue reports submitted yet." />
      </section>
      <ReportIssueModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={loadIssues} />
    </DashboardLayout>
  );
}

export default MyIssuesPage;
