import { Link, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo.jsx";

const menus = {
  // UI note: final navigation lists only implemented, meaningful modules for each role.
  ADMIN: [
    { label: "Overview", to: "/admin", enabled: true },
    { label: "Orders", to: "/admin/orders", enabled: true },
    { label: "Employees", to: "/admin/employees", enabled: true },
    { label: "Pricing Settings", to: "/admin/pricing-settings", enabled: true },
    { label: "Reports", to: "/admin/reports", enabled: true },
    { label: "Issue Reports", to: "/admin/issues", enabled: true },
    { label: "Audit Logs", to: "/admin/audit-logs", enabled: true },
    { label: "Assignment History", to: "/admin/assignments", enabled: true },
  ],
  CUSTOMER: [
    { label: "Overview", to: "/customer", enabled: true },
    { label: "Create Order", to: "/customer/create-order", enabled: true },
    { label: "My Orders", to: "/customer/orders", enabled: true },
    { label: "Track Order", to: "/customer/track", enabled: true },
    { label: "My Issues", to: "/issues/my", enabled: true },
  ],
  FINANCE_OFFICER: [
    { label: "Overview", to: "/finance", enabled: true },
    {
      label: "Payment Verification",
      to: "/finance/payment-verification",
      enabled: true,
    },
    { label: "Payment History", to: "/finance/payment-history", enabled: true },
    {
      label: "Outstanding Balances",
      to: "/finance/outstanding-balances",
      enabled: true,
    },
    { label: "My Issues", to: "/issues/my", enabled: true },
  ],
  PICKUP_AGENT: [
    { label: "Overview", to: "/pickup", enabled: true },
    { label: "Assigned Pickups", to: "/pickup/tasks", enabled: true },
    { label: "Pickup History", to: "/pickup/tasks/history", enabled: true },
    { label: "My Issues", to: "/issues/my", enabled: true },
  ],
  WAREHOUSE_STAFF: [
    { label: "Overview", to: "/warehouse", enabled: true },
    { label: "Arrival Queue", to: "/warehouse/arrival-queue", enabled: true },
    { label: "Warehouse Records", to: "/warehouse/records", enabled: true },
    {
      label: "Ready for Dispatch",
      to: "/warehouse/ready-for-dispatch",
      enabled: true,
    },
    { label: "Warehouse History", to: "/warehouse/history", enabled: true },
    { label: "My Issues", to: "/issues/my", enabled: true },
  ],
  DRIVER: [
    { label: "Overview", to: "/driver", enabled: true },
    { label: "Assigned Deliveries", to: "/driver/deliveries", enabled: true },
    {
      label: "Delivery History",
      to: "/driver/deliveries/history",
      enabled: true,
    },
    { label: "My Issues", to: "/issues/my", enabled: true },
  ],
};

function Sidebar({ role, open, onClose }) {
  const location = useLocation();
  const items = menus[role] || [];

  function isActive(item) {
    if (!item.to) {
      return false;
    }
    if (
      item.to === "/admin" ||
      item.to === "/customer" ||
      item.to === "/finance" ||
      item.to === "/pickup" ||
      item.to === "/warehouse" ||
      item.to === "/driver"
    ) {
      return location.pathname === item.to;
    }
    return (
      location.pathname === item.to ||
      location.pathname.startsWith(`${item.to}/`)
    );
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/70 lg:hidden ${open ? "block" : "hidden"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[#0A0F19] shadow-2xl shadow-black/30 transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <BrandLogo to="/app" mark="circle" />
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.24em] text-[#4B5563]">
            Navigation
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {items.map((item) => {
            const active = isActive(item);
            const baseClass =
              "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition";
            const activeClass = active
              ? "bg-[#22C55E] text-[#07110B] shadow-lg shadow-[#22C55E]/15"
              : "text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]";

            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={`${baseClass} ${activeClass}`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22C55E]">
            Paragrein Control
          </p>
          <p className="mt-1 text-sm text-[#64748B]">
            Secure logistics operations.
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
