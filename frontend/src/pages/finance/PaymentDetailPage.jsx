import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getFinancePaymentDetail, rejectAdvancePayment, verifyAdvancePayment } from '../../api/financeApi.js';
import Modal from '../../components/Modal.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import SecondaryButton from '../../components/SecondaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { formatDateTime, formatMoney, formatProductMessage, formatStatus, statusVariant } from '../../utils/formatters.js';

function InfoRow({ label, value }) {
  return (
    <div className="rounded-lg border border-[#263247] bg-[#111827] p-3">
      <p className="text-xs uppercase tracking-wide text-[#64748B]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#F8FAFC]">{formatProductMessage(value) || '-'}</p>
    </div>
  );
}

function PaymentDetailPage() {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const [modalMode, setModalMode] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPayment();
  }, [paymentId]);

  async function loadPayment() {
    try {
      setLoading(true);
      const data = await getFinancePaymentDetail(paymentId);
      setPayment(data);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitVerify() {
    try {
      setProcessing(true);
      const data = await verifyAdvancePayment(payment.paymentId);
      setPayment(data);
      setMessage('Advance payment verified.');
      setModalMode('');
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
      const data = await rejectAdvancePayment(payment.paymentId, rejectionReason.trim());
      setPayment(data);
      setMessage('Advance payment rejected.');
      setModalMode('');
      setRejectionReason('');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setProcessing(false);
    }
  }

  const canProcess = payment?.paymentStatus === 'SUBMITTED'
    && payment?.financialStatus === 'ADVANCE_SUBMITTED'
    && payment?.orderStatus === 'PENDING_ADVANCE_VERIFICATION';

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Finance"
        title={payment ? payment.trackingNumber : 'Payment Detail'}
        description="Review advance payment reference, receipt summary, customer details, route, and cost values."
        actions={<Link to="/finance/payment-verification"><SecondaryButton>Back to Verification</SecondaryButton></Link>}
      />

      {message && <div className="mt-6 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{message}</div>}
      {error && <div className="mt-6 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
      {loading && <p className="mt-8 text-sm text-[#94A3B8]">Loading payment detail...</p>}

      {payment && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="grid gap-6">
            <div className="pg-panel p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Verification State</h2>
                  <p className="mt-1 text-sm text-[#94A3B8]">Submitted {formatDateTime(payment.submittedAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge variant={statusVariant(payment.paymentStatus)}>{formatStatus(payment.paymentStatus)}</StatusBadge>
                  <StatusBadge variant={statusVariant(payment.financialStatus)}>{formatStatus(payment.financialStatus)}</StatusBadge>
                </div>
              </div>
              {canProcess && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <PrimaryButton onClick={() => setModalMode('verify')}>Verify Payment</PrimaryButton>
                  <button type="button" onClick={() => setModalMode('reject')} className="rounded-md bg-[#EF4444] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#DC2626]">
                    Reject Payment
                  </button>
                </div>
              )}
            </div>

            <div className="pg-panel p-5">
              <h2 className="text-xl font-bold">Customer and Route</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoRow label="Customer" value={payment.customerName} />
                <InfoRow label="Customer Email" value={payment.customerEmail} />
                <InfoRow label="Customer Phone" value={payment.customerPhone} />
                <InfoRow label="Pickup Address" value={payment.pickupAddress} />
                <InfoRow label="Drop-off Address" value={payment.dropoffAddress} />
                <InfoRow label="Route Distance" value={`${Number(payment.routeDistanceKm).toFixed(2)} km`} />
              </div>
            </div>

            <div className="pg-panel p-5">
              <h2 className="text-xl font-bold">Sender and Receiver</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoRow label="Sender" value={payment.senderName} />
                <InfoRow label="Sender Phone" value={payment.senderPhone} />
                <InfoRow label="Sender Address" value={payment.senderAddress} />
                <InfoRow label="Receiver" value={payment.receiverName} />
                <InfoRow label="Receiver Phone" value={payment.receiverPhone} />
                <InfoRow label="Receiver Address" value={payment.receiverAddress} />
              </div>
            </div>
          </section>

          <aside className="grid gap-6 self-start">
            <div className="pg-panel p-5">
              <h2 className="text-xl font-bold">Payment Evidence</h2>
              <div className="mt-4 grid gap-3">
                <InfoRow label="Payment Reference" value={payment.paymentReference} />
                <InfoRow label="Advance Amount" value={formatMoney(payment.advanceAmount)} />
                <InfoRow label="Receipt Info" value={payment.receiptFileName || payment.receiptPath || 'No receipt uploaded'} />
                <InfoRow label="Verified By" value={payment.verifiedByUsername} />
                <InfoRow label="Verified At" value={formatDateTime(payment.verifiedAt)} />
                <InfoRow label="Rejection Reason" value={payment.rejectionReason} />
              </div>
            </div>

            <div className="pg-panel p-5">
              <h2 className="text-xl font-bold">Cost Breakdown</h2>
              <div className="mt-4 grid gap-3">
                <InfoRow label="Base Rate" value={formatMoney(payment.baseRate)} />
                <InfoRow label="Per KM Rate" value={formatMoney(payment.perKmRate)} />
                <InfoRow label="Total Amount" value={formatMoney(payment.totalAmount)} />
                <InfoRow label="Balance Amount" value={formatMoney(payment.balanceAmount)} />
                <InfoRow label="Parcel" value={payment.parcelDescription} />
                <InfoRow label="Weight" value={`${Number(payment.parcelWeightKg).toFixed(2)} kg`} />
              </div>
            </div>
          </aside>
        </div>
      )}

      <Modal open={modalMode === 'verify'} title="Verify Advance Payment" description="Confirm this customer advance payment." onClose={() => setModalMode('')}>
        <p className="text-sm text-[#94A3B8]">The order will be marked financially verified and become ready for admin assignment.</p>
        <div className="mt-5 flex justify-end gap-3">
          <SecondaryButton onClick={() => setModalMode('')}>Cancel</SecondaryButton>
          <PrimaryButton onClick={submitVerify} disabled={processing}>{processing ? 'Verifying...' : 'Confirm Verify'}</PrimaryButton>
        </div>
      </Modal>

      <Modal open={modalMode === 'reject'} title="Reject Advance Payment" description="A rejection reason is required." onClose={() => setModalMode('')}>
        <label className="block">
          <span className="pg-label">Rejection Reason</span>
          <textarea value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} className="pg-field mt-2 min-h-28" />
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <SecondaryButton onClick={() => setModalMode('')}>Cancel</SecondaryButton>
          <button type="button" onClick={submitReject} disabled={processing} className="rounded-md bg-[#EF4444] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#DC2626] disabled:opacity-60">
            {processing ? 'Rejecting...' : 'Confirm Reject'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default PaymentDetailPage;
