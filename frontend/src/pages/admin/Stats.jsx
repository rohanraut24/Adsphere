import { useEffect, useState } from 'react'
import { adminApi } from '../../api'
import StatCard from '../../components/StatCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Users, Globe, Megaphone, LayoutGrid, Eye, MousePointerClick, DollarSign, TrendingUp } from 'lucide-react'

export default function AdminStats() {
  const [stats, setStats] = useState(null)

  useEffect(() => { adminApi.getStats().then((r) => setStats(r.data)) }, [])

  if (!stats) return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}</div>
    </div>
  )

  const revenueData = [
    { name: 'Platform (10%)', value: Number(stats.totalPlatformRevenue) },
    { name: 'Network (20%)', value: Number(stats.totalNetworkRevenue) },
    { name: 'Publisher (70%)', value: Number(stats.totalNetworkRevenue) * 3.5 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Platform Statistics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Real-time overview of the AdSphere platform</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="indigo" />
        <StatCard label="Total Websites" value={stats.totalWebsites} icon={Globe} color="cyan" />
        <StatCard label="Total Campaigns" value={stats.totalCampaigns} icon={Megaphone} color="amber" />
        <StatCard label="Total Placements" value={stats.totalPlacements} icon={LayoutGrid} color="violet" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Impressions" value={Number(stats.totalImpressions).toLocaleString()} icon={Eye} color="indigo" />
        <StatCard label="Total Clicks" value={Number(stats.totalClicks).toLocaleString()} icon={MousePointerClick} color="emerald" />
        <StatCard label="Platform Revenue" value={`$${Number(stats.totalPlatformRevenue).toFixed(4)}`} icon={DollarSign} color="rose" />
        <StatCard label="Network Revenue" value={`$${Number(stats.totalNetworkRevenue).toFixed(4)}`} icon={TrendingUp} color="violet" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="section-title mb-4">Revenue Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(4)}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} width={100} />
              <Tooltip formatter={(v) => [`$${Number(v).toFixed(4)}`, 'Revenue']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="section-title mb-4">Platform Summary</h2>
          <div className="space-y-4">
            {[
              { label: 'Click-through Rate', value: stats.totalImpressions > 0 ? `${((stats.totalClicks / stats.totalImpressions) * 100).toFixed(2)}%` : '0%', bar: stats.totalImpressions > 0 ? (stats.totalClicks / stats.totalImpressions) * 100 : 0, color: 'bg-indigo-500' },
              { label: 'Campaigns per User', value: stats.totalUsers > 0 ? (stats.totalCampaigns / stats.totalUsers).toFixed(1) : '0', bar: Math.min((stats.totalCampaigns / Math.max(stats.totalUsers, 1)) * 20, 100), color: 'bg-emerald-500' },
              { label: 'Placements per Website', value: stats.totalWebsites > 0 ? (stats.totalPlacements / stats.totalWebsites).toFixed(1) : '0', bar: Math.min((stats.totalPlacements / Math.max(stats.totalWebsites, 1)) * 20, 100), color: 'bg-amber-500' },
            ].map(({ label, value, bar, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(bar, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
