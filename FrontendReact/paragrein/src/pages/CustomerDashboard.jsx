import { useMemo } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo_circle.png";

const quickActions = [
  { title: "Create Shipment", icon: "fa-solid fa-box-open" },
  { title: "Track Orders", icon: "fa-solid fa-location-dot" },
  { title: "View Invoices", icon: "fa-solid fa-file-invoice-dollar" },
];

const liveUpdates = [
  { id: 1, text: "Colombo → Kandy shipment departed", time: "2 min ago" },
  { id: 2, text: "Your package reached sorting center", time: "11 min ago" },
  { id: 3, text: "Delivery partner assigned", time: "24 min ago" },
];

export default function CustomerDashboard() {
  const customerName = localStorage.getItem("name") || "Customer";
  const loginMessage = localStorage.getItem("loginMessage") || "";

  const subtitle = useMemo(() => {
    if (loginMessage.trim()) {
      return loginMessage;
    }
    return "Your shipments, updates, and support in one beautiful workspace.";
  }, [loginMessage]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-green-500/20 blur-3xl animate-float-slow" />
      <div className="absolute top-40 -right-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl animate-float-medium" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-float-fast" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="glass-strong rounded-3xl p-6 shadow-2xl shadow-green-900/20 md:p-8 animate-fade-up">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Paragrein" className="h-14 w-14 animate-gentle-zoom" />
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-green-400/90">Paragrein Customer</p>
                <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                  Hello, {customerName}
                </h1>
              </div>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:bg-green-600"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("name");
                localStorage.removeItem("loginMessage");
              }}
            >
              <i className="fa-solid fa-right-from-bracket" />
              Logout
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-200 sm:text-base">{subtitle}</p>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {quickActions.map((action, index) => (
            <div
              key={action.title}
              className="glass rounded-2xl p-5 transition duration-500 hover:-translate-y-1 hover:border-green-400/60 hover:shadow-xl hover:shadow-green-500/10 animate-fade-up"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                <i className={action.icon} />
              </div>
              <h2 className="text-lg font-semibold text-white">{action.title}</h2>
              <p className="mt-2 text-sm text-slate-300">
                Access this module quickly to manage your logistics workflow.
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-5">
          <div className="glass-strong rounded-2xl p-6 lg:col-span-3 animate-fade-up">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Shipping Performance</h3>
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300 animate-pulse">
                Live
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-900/60 p-4">
                <p className="text-sm text-slate-300">On-time Deliveries</p>
                <p className="mt-2 text-2xl font-bold text-green-400">96%</p>
              </div>
              <div className="rounded-xl bg-slate-900/60 p-4">
                <p className="text-sm text-slate-300">Active Orders</p>
                <p className="mt-2 text-2xl font-bold text-cyan-300">12</p>
              </div>
              <div className="rounded-xl bg-slate-900/60 p-4">
                <p className="text-sm text-slate-300">Avg. Delivery Time</p>
                <p className="mt-2 text-2xl font-bold text-emerald-300">1.8 days</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 lg:col-span-2 animate-fade-up">
            <h3 className="text-xl font-semibold text-white">Live Updates</h3>
            <ul className="mt-5 space-y-4">
              {liveUpdates.map((update) => (
                <li key={update.id} className="rounded-xl bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-100">{update.text}</p>
                  <p className="mt-1 text-xs text-slate-400">{update.time}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
