function SecondaryButton({ children, className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`rounded-md border border-[#263247] bg-[#111827] px-4 py-2.5 text-sm font-semibold text-[#F8FAFC] transition hover:border-[#22C55E]/60 hover:bg-[#1B2233] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default SecondaryButton;
