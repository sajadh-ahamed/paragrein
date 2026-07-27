const styles = {
  active: 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#86EFAC]',
  inactive: 'border-[#475569] bg-[#1E293B] text-[#CBD5E1]',
  warning: 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#FCD34D]',
  error: 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#FCA5A5]',
  neutral: 'border-[#263247] bg-[#111827] text-[#94A3B8]',
};

function StatusBadge({ children, variant = 'neutral' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[variant] || styles.neutral}`}>
      {children}
    </span>
  );
}

export default StatusBadge;
