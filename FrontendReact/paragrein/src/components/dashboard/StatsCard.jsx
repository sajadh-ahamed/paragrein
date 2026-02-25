export default function StatsCard({ title, value }) {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-white mt-2">{value}</h2>
    </div>
  );
}
