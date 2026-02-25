export default function Sidebar() {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-slate-900 text-white p-6">
      <h1 className="text-xl font-bold text-green-500 mb-6">Paragrein</h1>

      <nav className="space-y-3">
        <div className="text-green-500">Overview</div>
        <div className="text-gray-300">Live Shipment Map</div>
        <div className="text-gray-300">Fleet Status</div>
      </nav>
    </aside>
  );
}
