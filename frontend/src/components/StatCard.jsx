export default function StatCard({ label, value, sub, icon: Icon, color = 'indigo', trend }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    rose: 'bg-rose-50 text-rose-600',
  }
  return (
    <div className="card p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      {Icon && (
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        {trend !== undefined && (
          <p className={`text-xs mt-1 font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
    </div>
  )
}
