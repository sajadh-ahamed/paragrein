import logo from "../../assets/images/logo_circle.png";

function InfoCard({ title, value, icon, hint }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{title}</span>
        <i className={`${icon} text-green-500`}></i>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <p className="text-xs text-gray-400">{hint}</p>
    </div>
  );
}

export default function WorkerDashboardLayout({
  roleLabel,
  greeting,
  subtitle,
  menuItems,
  cards,
  checklist,
  updates,
}) {
  const username = localStorage.getItem("name") || "User";
  const loginMessage = localStorage.getItem("loginMessage") || "";

  return (
    <div className="flex min-h-screen">
      <aside className="sidebar-glass w-64 h-screen fixed left-0 top-0 p-6">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="Paragrein" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-green-500">Paragrein</h1>
        </div>

        <p className="text-xs uppercase tracking-wider text-gray-400 px-2 py-2 mb-2">
          {roleLabel} Panel
        </p>
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                index === 0
                  ? "menu-item-active"
                  : "text-gray-300 hover:bg-white/5 hover:text-green-500"
              }`}
            >
              <i className={`${item.icon} w-5 text-center`}></i>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {greeting}, {username}
            </h1>
            <p className="text-gray-400">
              {loginMessage || subtitle}
            </p>
          </div>

          <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 font-semibold text-sm border border-green-500/30">
            {roleLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {cards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Today Focus</h2>
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li
                  key={item}
                  className="glass-strong rounded-xl px-4 py-3 text-sm text-gray-200"
                >
                  <i className="fa-solid fa-circle-check text-green-500 mr-2"></i>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Updates</h2>
            <ul className="space-y-4">
              {updates.map((update) => (
                <li key={update.title} className="border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                  <p className="text-white font-semibold">{update.title}</p>
                  <p className="text-sm text-gray-400">{update.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
