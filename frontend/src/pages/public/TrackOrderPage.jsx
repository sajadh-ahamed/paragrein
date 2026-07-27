import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { trackOrderPublic } from '../../api/publicTrackingApi.js';
import { brandImages } from '../../assets/imageAssets.js';
import FormInput from '../../components/FormInput.jsx';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { formatDateTime, formatStatus, statusVariant } from '../../utils/formatters.js';

function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const initialTrackingNumber = searchParams.get('tracking') || '';
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const autoTrackedValue = useRef('');

  async function runSearch(value) {
    const normalizedValue = value.trim();
    setError('');
    setResult(null);
    if (!/^[A-Za-z0-9-]{3,80}$/.test(normalizedValue)) {
      setError('Please enter a valid tracking number.');
      return;
    }

    try {
      setLoading(true);
      const data = await trackOrderPublic(normalizedValue);
      setResult(data);
    } catch (apiError) {
      if (apiError.status === 404) {
        setError('Tracking number not found.');
      } else if (apiError.status === 400) {
        setError('Please enter a valid tracking number.');
      } else {
        setError('Unable to check tracking right now. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function search(event) {
    event.preventDefault();
    runSearch(trackingNumber);
  }

  useEffect(() => {
    if (initialTrackingNumber && autoTrackedValue.current !== initialTrackingNumber) {
      autoTrackedValue.current = initialTrackingNumber;
      runSearch(initialTrackingNumber);
    }
  }, [initialTrackingNumber]);

  return (
    <PublicLayout>
      <main className="relative min-h-[calc(100vh-73px)] overflow-hidden">
        <img src={brandImages.clientsideBg3} alt="Logistics tracking background" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/88 via-[#070B14]/92 to-[#070B14]" />
        <div className="relative mx-auto w-full max-w-4xl px-6 py-16">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#22C55E]">Public Tracking</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#F8FAFC]">Track a Paragrein Parcel</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#94A3B8]">
            Public tracking shows limited parcel status only. Sender, receiver, address, and payment details stay private.
          </p>
        </div>

        <section className="pg-panel mx-auto mt-10 max-w-2xl p-6">
          <form onSubmit={search} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <FormInput label="Tracking Number" value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} placeholder="PGR-2026-000001" />
            <PrimaryButton type="submit" disabled={loading}>{loading ? 'Searching...' : 'Track Order'}</PrimaryButton>
          </form>
          {error && <div className="mt-5 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}
        </section>

        {result && (
          <section className="pg-panel mx-auto mt-6 max-w-2xl p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#F8FAFC]">{result.trackingNumber}</h2>
                <p className="mt-2 text-sm text-[#94A3B8]">{result.publicMessage}</p>
              </div>
              <StatusBadge variant={statusVariant(result.orderStatus)}>{formatStatus(result.orderStatus)}</StatusBadge>
            </div>
            <div className="mt-5 rounded-lg border border-[#263247] bg-[#111827] p-4 text-sm text-[#94A3B8]">
              <p>Financial status: {formatStatus(result.financialStatus)}</p>
              <p className="mt-1">Last updated: {formatDateTime(result.lastUpdatedAt)}</p>
            </div>
            <p className="mt-5 text-sm text-[#94A3B8]">
              Need full details? <Link to="/login" className="font-semibold text-[#22C55E] hover:underline">Login to your customer account</Link>.
            </p>
          </section>
        )}
        </div>
      </main>
    </PublicLayout>
  );
}

export default TrackOrderPage;
