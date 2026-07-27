function BackendStatusCard({ status, message, error, onRefresh }) {
  const statusStyles = {
    checking: 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#FCD34D]',
    online: 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#86EFAC]',
    offline: 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#FCA5A5]',
  };

  const statusLabels = {
    checking: 'Checking backend connection',
    online: 'Backend reachable',
    offline: 'Backend not reachable',
  };

  return (
    <section className="pg-panel p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#22C55E]">
            Backend Connection Status
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#F8FAFC]">
            Local Spring Boot API
          </h2>
        </div>

        <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${statusStyles[status]}`}>
          {statusLabels[status]}
        </span>
      </div>

      <div className="mt-5 rounded-md border border-[#263247] bg-[#111827] p-4 text-sm text-[#CBD5E1]">
        {status === 'online' && <p>{message}</p>}
        {status === 'checking' && <p>Trying GET /api/health on http://localhost:8080...</p>}
        {status === 'offline' && (
          <p>
            {error || 'Start the backend server and try again.'}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="mt-5 rounded-md bg-[#22C55E] px-4 py-2 text-sm font-semibold text-[#07110B] transition hover:bg-[#16A34A]"
      >
        Refresh Status
      </button>
    </section>
  );
}

export default BackendStatusCard;
