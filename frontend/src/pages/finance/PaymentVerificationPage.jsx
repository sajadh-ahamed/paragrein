import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPendingAdvancePayments, rejectAdvancePayment, verifyAdvancePayment } from '../../api/financeApi.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatMoney, formatStatus, statusVariant } from '../../utils/formatters.js';

function PaymentVerificationPage() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalMode, setModalMode] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      setLoading(true);
      const data = await getPendingAdvancePayments();
      setPayments(data || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  function openModal(payment, mode) {
    setSelectedPayment(payment);
    setModalMode(mode);
    setRejectionReason('');
    setError('');
    setMessage('');
  }

  function closeModal() {
    setSelectedPayment(null);
    setModalMode('');
    setRejectionReason('');
  }

  async function submitVerify() {
    try {
      setProcessing(true);
      await verifyAdvancePayment(selectedPayment.paymentId);
      setMessage(`Payment verified for ${selectedPayment.trackingNumber}.`);
      closeModal();
      await loadPayments();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setProcessing(false);
    }
  }

  async function submitReject() {
    if (!rejectionReason.trim()) {
      setError('Rejection reason is required.');
      return;
    }
    try {
      setProcessing(true);
      await rejectAdvancePayment(selectedPayment.paymentId, rejectionReason.trim());
      setMessage(`Payment rejected for ${selectedPayment.trackingNumber}.`);
      closeModal();
      await loadPayments();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setProcessing(false);
    }
  }

  const columns = [
    { key: 'trackingNumber', header: 'Tracking Number', render: (payment) => <span className="font-bold text-[#F8FAFC]">{payment.trackingNumber}</span> },
    { key: 'customerName', header: 'Customer Name' },
    { key: 'paymentReference', header: 'Payment Reference' },
    { key: 'advanceAmount', header: 'Advance Amount', render: (payment) => <span className="font-bold text-[#86EFAC]">{formatMoney(payment.advanceAmount)}</span> },
    { key: 'totalAmount', header: 'Total Amount', render: (payment) => formatMoney(payment.totalAmount) },
    { key: 'submittedAt', header: 'Submitted Date', render: (payment) => formatDateTime(payment.submittedAt) },
    { key: 'paymentStatus', header: 'Status', render: (payment) => <StatusBadge variant={statusVariant(payment.paymentStatus)}>{formatStatus(payment.paymentStatus)}</StatusBadge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (payment) => (
        <div className="flex flex-wrap gap-2">
          <Link to={`/finance/payments/${payment.paymentId}`}><SecondaryButton className="px-3 py-1.5 text-xs">View Details</SecondaryButton></Link>
          <PrimaryButton onClick={() => openModal(payment, 'verify')} className="px-3 py-1.5 text-xs">Verify</PrimaryButton>
          <button type="button" onClick={() => openModal(payment, 'reject')} className="rounded-md border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-1.5 text-xs font-semibold text-[#FCA5A5] transition hover:bg-[#EF4444]/20">
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Finance"
        title="Payment Verification"
        description="Review customer advance payment references before orders move to the admin assignment queue."
      />

      {message && <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{message}</div>}
      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <section className="pg-panel mt-6 p-5">
        <DataTable columns={columns} data={payments} loading={loading} emptyMessage="No pending advance payments." />
      </section>

      <Modal
        open={modalMode === 'verify'}
        title="Verify Advance Payment"
        description={selectedPayment ? `Confirm verification for ${selectedPayment.trackingNumber}.` : ''}
        onClose={closeModal}
      >
        <p className="text-sm leading-6 text-[#94A3B8]">
          This will mark the payment as VERIFIED, update the order financial status to ADVANCE_VERIFIED, and notify the customer and admins.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
          <PrimaryButton onClick={submitVerify} disabled={processing}>{processing ? 'Verifying...' : 'Confirm Verify'}</PrimaryButton>
        </div>
      </Modal>

      <Modal
        open={modalMode === 'reject'}
        title="Reject Advance Payment"
        description={selectedPayment ? `Provide a reason for rejecting ${selectedPayment.trackingNumber}.` : ''}
        onClose={closeModal}
      >
        <label className="block">
          <span className="pg-label">Rejection Reason</span>
          <textarea value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} className="pg-field mt-2 min-h-28" />
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
          <button type="button" onClick={submitReject} disabled={processing} className="rounded-md bg-[#EF4444] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#DC2626] disabled:cursor-not-allowed disabled:opacity-60">
            {processing ? 'Rejecting...' : 'Confirm Reject'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default PaymentVerificationPage;
