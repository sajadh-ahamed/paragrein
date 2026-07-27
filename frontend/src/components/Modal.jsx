import SecondaryButton from './SecondaryButton.jsx';

function Modal({ open, title, description, children, footer, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-[#263247] bg-[#151B2B] shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-4 border-b border-[#263247] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-[#F8FAFC]">{title}</h2>
            {description && <p className="mt-1 text-sm text-[#94A3B8]">{description}</p>}
          </div>
          <SecondaryButton onClick={onClose} className="px-3 py-1.5">
            Close
          </SecondaryButton>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="border-t border-[#263247] px-6 py-4">{footer}</div>}
      </section>
    </div>
  );
}

export default Modal;
