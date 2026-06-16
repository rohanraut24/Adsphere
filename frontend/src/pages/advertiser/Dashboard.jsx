import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { advertiserApi, publisherApi } from '../../api'
import StatCard from '../../components/StatCard'
import Badge from '../../components/Badge'
import UpgradeRequestModal from '../../components/UpgradeRequestModal'
import { DollarSign, Megaphone, Clock, TrendingUp, Plus, ArrowRight, ShieldCheck } from 'lucide-react'

export default function AdvertiserDashboard() {
  const [spend, setSpend] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      advertiserApi.getSpend(),
      advertiserApi.getCampaigns(),
      advertiserApi.getTransactions(),
    ]).then(([s, c, t]) => {
      setSpend(s.data)
      setCampaigns(c.data)
      setTransactions(t.data)
      setLoading(false)
    })
  }, [])

  const [upgradeRequests, setUpgradeRequests] = useState([])
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    publisherApi.getUpgradeRequests().then((r) => setUpgradeRequests(r.data)).catch(() => {})
  }, [])

  const active = campaigns.filter((c) => c.status === 'ACTIVE').length
  const pending = campaigns.filter((c) => c.status === 'PENDING_APPROVAL').length
  const draft = campaigns.filter((c) => c.status === 'DRAFT').length
  const hasPendingUpgrade = upgradeRequests.some((r) => r.status === 'PENDING')

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of your advertising activity</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowUpgradeModal(true)}
            disabled={hasPendingUpgrade}
            className="btn-secondary flex items-center gap-2 text-violet-700 border-violet-200 hover:bg-violet-50 disabled:opacity-50">
            <ShieldCheck size={15} />
            {hasPendingUpgrade ? 'Upgrade Pending…' : 'Become a Publisher'}
          </button>
          <Link to="/advertiser/campaigns/new" className="btn-primary flex items-center gap-2">
            <Plus size={15} /> New Campaign
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Spend" value={spend !== null ? `$${Number(spend).toFixed(2)}` : '—'} icon={DollarSign} color="indigo" />
        <StatCard label="Active Campaigns" value={active} icon={TrendingUp} color="emerald" />
        <StatCard label="Pending Approval" value={pending} icon={Clock} color="amber" />
        <StatCard label="Draft Campaigns" value={draft} icon={Megaphone} color="violet" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Campaigns table */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="section-title">Recent Campaigns</h2>
            <Link to="/advertiser/campaigns" className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Megaphone size={36} className="text-gray-200 mb-3" />
              <p className="text-gray-500 text-sm font-medium">No campaigns yet</p>
              <p className="text-gray-400 text-xs mt-1 mb-4">Create your first campaign to get started</p>
              <Link to="/advertiser/campaigns/new" className="btn-primary text-xs px-3 py-1.5">Create Campaign</Link>
            </div>
          ) : (
            <table className="w-full">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="th text-left">Campaign</th>
                <th className="th text-left">Status</th>
                <th className="th text-right">Budget</th>
                <th className="th text-right">CPC</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {campaigns.slice(0, 6).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="td">
                      <Link to={`/advertiser/campaigns/${c.id}`} className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">{c.name}</Link>
                      <p className="text-xs text-gray-400 mt-0.5">{c.startDate} → {c.endDate}</p>
                    </td>
                    <td className="td"><Badge status={c.status} /></td>
                    <td className="td text-right font-medium">${c.budget}</td>
                    <td className="td text-right text-gray-500">${c.cpcBid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent transactions */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="section-title">Recent Transactions</h2>
          </div>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
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
                  <span className="text-sm font-semibold text-red-500">-${Number(t.totalAmount).toFixed(4)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showUpgradeModal && <UpgradeRequestModal currentRole="ADVERTISER" onClose={() => setShowUpgradeModal(false)} />}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
      </div>
      <div className="h-64 bg-gray-200 rounded-2xl" />
    </div>
  )
}
