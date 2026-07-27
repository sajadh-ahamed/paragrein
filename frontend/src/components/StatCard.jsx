function StatCard({ label, value, hint, tone = 'green' }) {
  const toneClass = tone === 'amber' ? 'text-[#F59E0B]' : tone === 'blue' ? 'text-[#60A5FA]' : 'text-[#22C55E]';

  return (
    <article className="pg-panel p-5">
      <p className="text-sm font-medium text-[#94A3B8]">{label}</p>
      <p className={`mt-3 text-3xl font-black ${toneClass}`}>{value}</p>
      {hint && <p className="mt-2 text-xs text-[#64748B]">{hint}</p>}
    </article>
  );
}

export default StatCard;
