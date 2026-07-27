//his page is displayed when a logged-in user tries to access a page that their role is not authorized to access.

import { Link } from 'react-router-dom';

function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070B14] px-6 text-[#F8FAFC]">
      <div className="pg-panel w-full max-w-md p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#EF4444]">Access Restricted</p>
        <h1 className="mt-2 text-3xl font-black">Unauthorized</h1>
        <p className="mt-3 text-sm text-[#94A3B8]">Your current role does not have permission to view this page.</p>
        <Link to="/app" className="mt-6 inline-flex rounded-md bg-[#22C55E] px-4 py-2 text-sm font-semibold text-[#07110B] hover:bg-[#16A34A]">
          Go to My Area
        </Link>
      </div>
    </main>
  );
}

export default UnauthorizedPage;
