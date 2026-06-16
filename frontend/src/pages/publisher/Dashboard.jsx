import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { publisherApi } from '../../api'
import StatCard from '../../components/StatCard'
import Badge from '../../components/Badge'
import UpgradeRequestModal from '../../components/UpgradeRequestModal'
import { DollarSign, Globe, LayoutGrid, TrendingUp, Plus, ArrowRight, ShieldCheck } from 'lucide-react'

export default function PublisherDashboard() {
  const [earnings, setEarnings] = useState(null)
  const [websites, setWebsites] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      publisherApi.getEarnings(),
      publisherApi.getWebsites(),
      publisherApi.getTransactions(),
    ]).then(([e, w, t]) => {
      setEarnings(e.data)
      setWebsites(w.data)
      setTransactions(t.data)
      setLoading(false)
    })
  }, [])

  const [upgradeRequests, setUpgradeRequests] = useState([])
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    publisherApi.getUpgradeRequests().then((r) => setUpgradeRequests(r.data)).catch(() => {})
  }, [])

  const approved = websites.filter((w) => w.status === 'APPROVED').length
  const pending = websites.filter((w) => w.status === 'PENDING').length
  const hasPendingUpgrade = upgradeRequests.some((r) => r.status === 'PENDING')

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48" /><div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}</div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your publishing revenue overview</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowUpgradeModal(true)}
            disabled={hasPendingUpgrade}
            className="btn-secondary flex items-center gap-2 text-violet-700 border-violet-200 hover:bg-violet-50 disabled:opacity-50">
            <ShieldCheck size={15} />
            {hasPendingUpgrade ? 'Upgrade Pending…' : 'Become Network Admin'}
          </button>
          <Link to="/publisher/websites/new" className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Register Website
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Earnings" value={earnings !== null ? `$${Number(earnings).toFixed(4)}` : '—'} icon={DollarSign} color="emerald" />
        <StatCard label="Total Websites" value={websites.length} icon={Globe} color="indigo" />
        <StatCard label="Approved" value={approved} icon={TrendingUp} color="cyan" />
        <StatCard label="Pending Review" value={pending} icon={LayoutGrid} color="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="section-title">My Websites</h2>
            <Link to="/publisher/websites" className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {websites.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Globe size={36} className="text-gray-200 mb-3" />
              <p className="text-gray-500 font-medium">No websites registered</p>
              <p className="text-gray-400 text-xs mt-1 mb-4">Register your first website to start earning</p>
              <Link to="/publisher/websites/new" className="btn-primary text-xs px-3 py-1.5">Register Website</Link>
            </div>
          ) : (
            <table className="w-full">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="th text-left">Website</th>
                <th className="th text-left">Category</th>
                <th className="th text-left">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {websites.slice(0, 6).map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                    <td className="td">
                      <Link to={`/publisher/websites/${w.id}`} className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">{w.name}</Link>
                      <p className="text-xs text-gray-400">{w.url}</p>
                    </td>
                    <td className="td text-gray-500">{w.category}</td>
                    <td className="td"><Badge status={w.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="section-title">Recent Earnings</h2>
          </div>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <DollarSign size={32} className="text-gray-200 mb-2" />
              <p className="text-gray-400 text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {transactions.slice(0, 8).map((t) => (
                <div key={t.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-700">Placement #{t.placementId}</p>
                    <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-600">+${Number(t.publisherShare).toFixed(4)}</p>
                    <p className="text-xs text-gray-400">of ${Number(t.totalAmount).toFixed(4)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showUpgradeModal && <UpgradeRequestModal currentRole="PUBLISHER" onClose={() => setShowUpgradeModal(false)} />}
    </div>
  )
}
