import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { advertiserApi } from '../../api'
import Badge from '../../components/Badge'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { ArrowLeft, Edit, Play, Pause, Send, Trash2, MousePointerClick, Eye, Percent, DollarSign, Plus, Image } from 'lucide-react'

const today = new Date().toISOString().slice(0, 10)
const monthAgo = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10)

const EMPTY_CREATIVE = { title: '', description: '', imageUrl: '', destinationUrl: '' }

export default function CampaignDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState(null)
  const [creatives, setCreatives] = useState([])
  const [placements, setPlacements] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [daily, setDaily] = useState([])
  const [newCreative, setNewCreative] = useState(EMPTY_CREATIVE)
  const [showCreativeForm, setShowCreativeForm] = useState(false)

  useEffect(() => {
    advertiserApi.getCampaign(id).then((r) => setCampaign(r.data))
    advertiserApi.getCreatives(id).then((r) => setCreatives(r.data))
    advertiserApi.getPlacements(id).then((r) => setPlacements(r.data))
    advertiserApi.getAnalytics(id, monthAgo, today).then((r) => setAnalytics(r.data)).catch(() => {})
    advertiserApi.getDailyAnalytics(id, monthAgo, today).then((r) => setDaily(r.data)).catch(() => {})
  }, [id])

  const refreshCampaign = () => advertiserApi.getCampaign(id).then((r) => setCampaign(r.data))

  const addCreative = async (e) => {
    e.preventDefault()
    await advertiserApi.addCreative(id, newCreative)
    advertiserApi.getCreatives(id).then((r) => setCreatives(r.data))
    setNewCreative(EMPTY_CREATIVE)
    setShowCreativeForm(false)
  }

  if (!campaign) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => navigate(-1)} className="mt-1 p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer text-gray-500">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="page-title">{campaign.name}</h1>
            <Badge status={campaign.status} />
          </div>
          {campaign.description && <p className="text-sm text-gray-500 mt-1">{campaign.description}</p>}
        </div>
        <div className="flex gap-2 shrink-0">
          {campaign.status === 'DRAFT' && (<>
            <Link to={`/advertiser/campaigns/${id}/edit`} className="btn-secondary flex items-center gap-1.5 text-xs">
              <Edit size={13} /> Edit
            </Link>
            <button onClick={() => advertiserApi.submitCampaign(id).then(refreshCampaign)}
              className="btn-primary flex items-center gap-1.5 text-xs py-1.5">
              <Send size={13} /> Submit for Approval
            </button>
          </>)}
          {campaign.status === 'ACTIVE' && (
            <button onClick={() => advertiserApi.pauseCampaign(id).then(refreshCampaign)}
              className="btn-warn flex items-center gap-1.5">
              <Pause size={13} /> Pause
            </button>
          )}
          {campaign.status === 'PAUSED' && (
            <button onClick={() => advertiserApi.resumeCampaign(id).then(refreshCampaign)}
              className="btn-success flex items-center gap-1.5">
              <Play size={13} /> Resume
            </button>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Budget', value: `$${Number(campaign.budget).toLocaleString()}`, icon: DollarSign },
          { label: 'CPC Bid', value: `$${campaign.cpcBid}`, icon: MousePointerClick },
          { label: 'Start Date', value: campaign.startDate, icon: null },
          { label: 'End Date', value: campaign.endDate, icon: null },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-lg font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Analytics summary */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Impressions', value: analytics.totalImpressions?.toLocaleString(), icon: Eye, color: 'indigo' },
            { label: 'Total Clicks', value: analytics.totalClicks?.toLocaleString(), icon: MousePointerClick, color: 'emerald' },
            { label: 'CTR', value: `${(analytics.ctr * 100).toFixed(2)}%`, icon: Percent, color: 'amber' },
            { label: 'Total Cost', value: `$${Number(analytics.totalRevenue).toFixed(4)}`, icon: DollarSign, color: 'rose' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`p-2 rounded-xl ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {daily.length > 0 && (
        <div className="card p-6">
          <h2 className="section-title mb-4">Daily Performance — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="impressions" stroke="#6366f1" strokeWidth={2} dot={false} name="Impressions" />
              <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} dot={false} name="Clicks" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Ad Creatives */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="section-title">Ad Creatives</h2>
          <button onClick={() => setShowCreativeForm((p) => !p)} className="btn-primary text-xs flex items-center gap-1.5 py-1.5">
            <Plus size={13} /> Add Creative
          </button>
        </div>

        {showCreativeForm && (
          <form onSubmit={addCreative} className="p-5 bg-indigo-50 border-b border-indigo-100 grid grid-cols-2 gap-3">
            {[['title', 'Title *'], ['description', 'Description'], ['imageUrl', 'Image URL'], ['destinationUrl', 'Destination URL *']].map(([f, lbl]) => (
              <div key={f}>
                <label className="label text-xs">{lbl}</label>
                <input value={newCreative[f]} onChange={(e) => setNewCreative((p) => ({ ...p, [f]: e.target.value }))}
                  className="input text-sm" required={f === 'title' || f === 'destinationUrl'} />
              </div>
            ))}
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="btn-primary text-xs">Save Creative</button>
              <button type="button" onClick={() => setShowCreativeForm(false)} className="btn-secondary text-xs">Cancel</button>
            </div>
          </form>
        )}

        {creatives.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Image size={32} className="text-gray-200 mb-2" />
            <p className="text-gray-400 text-sm">No creatives yet. Add one above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {creatives.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.title} className="w-14 h-10 rounded-lg object-cover border border-gray-100 shrink-0" onError={(e) => { e.target.style.display = 'none' }} />
                ) : (
                  <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Image size={16} className="text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{c.title}</p>
                  {c.description && <p className="text-xs text-gray-400 truncate">{c.description}</p>}
                  <a href={c.destinationUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline truncate block">{c.destinationUrl}</a>
                </div>
                <button onClick={() => advertiserApi.deleteCreative(id, c.id).then(() => setCreatives((p) => p.filter((x) => x.id !== c.id)))}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Placements */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="section-title">Active Placements</h2>
        </div>
        {placements.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-400">No placements yet — a publisher needs to add this campaign to their website.</p>
        ) : (
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="th text-left">Website</th>
              <th className="th text-center">Status</th>
              <th className="th text-left">Created</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {placements.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="td font-medium">{p.websiteUrl}</td>
                  <td className="td text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${p.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="td text-gray-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
