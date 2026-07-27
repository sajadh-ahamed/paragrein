import { useState } from 'react';
import { createIssueReport } from '../api/issueApi.js';
import Modal from './Modal.jsx';
import PrimaryButton from './PrimaryButton.jsx';
import SecondaryButton from './SecondaryButton.jsx';

const initialForm = {
  title: '',
  description: '',
  severity: 'LOW',
};

function ReportIssueModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitIssue(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      if (!form.title.trim()) {
        setError('Issue title is required.');
        return;
      }
      if (!form.description.trim()) {
        setError('Issue description is required.');
        return;
      }
      await createIssueReport(form);
      setSuccess('Issue submitted. Admin can now review it.');
      setForm(initialForm);
      if (onCreated) {
        onCreated();
      }
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  function closeModal() {
    setError('');
    setSuccess('');
    onClose();
  }

  return (
    <Modal
      open={open}
      title="Report Issue"
      description="Send a local issue report to the admin team. No external service is used."
      onClose={closeModal}
    >
      <form onSubmit={submitIssue} className="space-y-4">
        {error && <div className="rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
        {success && <div className="rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{success}</div>}

        <label className="block">
          <span className="pg-label">Title</span>
          <input name="title" value={form.title} onChange={updateField} className="pg-field mt-2" placeholder="Brief issue title" />
        </label>

        <label className="block">
          <span className="pg-label">Severity</span>
          <select name="severity" value={form.severity} onChange={updateField} className="pg-field mt-2">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </label>

        <label className="block">
          <span className="pg-label">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            className="pg-field mt-2 min-h-32"
            placeholder="Describe what happened and where it happened."
          />
        </label>

        <div className="flex flex-wrap justify-end gap-3">
          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Issue'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

export default ReportIssueModal;
