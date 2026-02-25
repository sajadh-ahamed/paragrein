export default function Topbar() {
  return (
    <div className="flex justify-between items-center mb-8">
      <input
        type="text"
        placeholder="Search..."
        className="px-4 py-2 rounded-lg bg-slate-800 text-white"
      />

      <div className="flex gap-3">
        <button className="bg-green-500 px-4 py-2 rounded-lg text-white">
          + Add Vehicle
        </button>
        <button className="bg-green-500 px-4 py-2 rounded-lg text-white">
          + New Shipment
        </button>
      </div>
    </div>
  );
}
