import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { publisherApi } from '../../api'
import Badge from '../../components/Badge'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { ArrowLeft, Eye, MousePointerClick, Percent, DollarSign, ToggleLeft, ToggleRight, Plus, Edit } from 'lucide-react'

const today = new Date().toISOString().slice(0, 10)
const monthAgo = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10)

export default function WebsiteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [website, setWebsite] = useState(null)
  const [placements, setPlacements] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [daily, setDaily] = useState([])
  const [placement, setPlacement] = useState({ campaignId: '', adCreativeId: '' })
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    publisherApi.getWebsite(id).then((r) => setWebsite(r.data))
    publisherApi.getPlacements(id).then((r) => setPlacements(r.data))
    publisherApi.getAnalytics(id, monthAgo, today).then((r) => setAnalytics(r.data)).catch(() => {})
    publisherApi.getDailyAnalytics(id, monthAgo, today).then((r) => setDaily(r.data)).catch(() => {})
  }, [id])

  const createPlacement = async (e) => {
    e.preventDefault()
    setFormError('')
    try {
      await publisherApi.createPlacement({
        websiteId: Number(id),
        campaignId: Number(placement.campaignId),
        ...(placement.adCreativeId ? { adCreativeId: Number(placement.adCreativeId) } : {}),
      })
      publisherApi.getPlacements(id).then((r) => setPlacements(r.data))
      setPlacement({ campaignId: '', adCreativeId: '' })
      setShowForm(false)
    } catch (e) {
      setFormError(e.response?.data?.error || 'Failed to create placement')
    }
  }

  const toggle = async (pid) => {
    await publisherApi.togglePlacement(pid)
    publisherApi.getPlacements(id).then((r) => setPlacements(r.data))
  }

  if (!website) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start gap-4">
        <button onClick={() => navigate(-1)} className="mt-1 p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer text-gray-500">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="page-title">{website.name}</h1>
            <Badge status={website.status} />
          </div>
          <a href={website.url} target="_blank" rel="noreferrer" className="text-sm text-indigo-500 hover:underline">{website.url}</a>
        </div>
        <Link to={`/publisher/websites/${id}/edit`} className="btn-secondary flex items-center gap-1.5 text-xs">
          <Edit size={13} /> Edit
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card p-4"><p className="text-xs text-gray-500 mb-1">Category</p><p className="font-bold text-gray-900">{website.category}</p></div>
        <div className="card p-4"><p className="text-xs text-gray-500 mb-1">Publisher</p><p className="font-bold text-gray-900 truncate text-sm">{website.publisherEmail}</p></div>
        <div className="card p-4"><p className="text-xs text-gray-500 mb-1">Registered</p><p className="font-bold text-gray-900">{new Date(website.createdAt).toLocaleDateString()}</p></div>
      </div>

      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Impressions', value: analytics.totalImpressions?.toLocaleString(), icon: Eye, color: 'indigo' },
            { label: 'Clicks', value: analytics.totalClicks?.toLocaleString(), icon: MousePointerClick, color: 'emerald' },
            { label: 'CTR', value: `${(analytics.ctr * 100).toFixed(2)}%`, icon: Percent, color: 'amber' },
            { label: 'Revenue', value: `$${Number(analytics.totalRevenue).toFixed(4)}`, icon: DollarSign, color: 'cyan' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`p-2 rounded-xl ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-cyan-50 text-cyan-600'}`}>
                <Icon size={16} />
              </div>
              <div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold text-gray-900">{value}</p></div>
            </div>
          ))}
        </div>
      )}

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

      {/* Placements */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="section-title">Ad Placements</h2>
          {website.status === 'APPROVED' && (
            <button onClick={() => setShowForm((p) => !p)} className="btn-primary text-xs flex items-center gap-1.5 py-1.5">
              <Plus size={13} /> Add Placement
            </button>
          )}
        </div>

        {website.status !== 'APPROVED' && (
          <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
            <p className="text-amber-700 text-sm">⚠ Your website must be <strong>APPROVED</strong> before you can add placements.</p>
          </div>
        )}

        {showForm && (
          <form onSubmit={createPlacement} className="p-5 bg-indigo-50 border-b border-indigo-100 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs">Campaign ID *</label>
                <input value={placement.campaignId} onChange={(e) => setPlacement((p) => ({ ...p, campaignId: e.target.value }))}
                  className="input text-sm" placeholder="Enter campaign ID" required />
              </div>
              <div>
                <label className="label text-xs">Creative ID (optional)</label>
                <input value={placement.adCreativeId} onChange={(e) => setPlacement((p) => ({ ...p, adCreativeId: e.target.value }))}
                  className="input text-sm" placeholder="Enter creative ID" />
              </div>
            </div>
            {formError && <p className="text-red-500 text-xs">{formError}</p>}
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-xs">Create Placement</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-xs">Cancel</button>
            </div>
          </form>
        )}

        {placements.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <p className="text-gray-400 text-sm">No placements yet.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="th text-left">Campaign</th>
              <th className="th text-center">Status</th>
              <th className="th text-left">Created</th>
              <th className="th text-center">Toggle</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {placements.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="td font-medium">{p.campaignName}</td>
                  <td className="td text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${p.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="td text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="td text-center">
                    <button onClick={() => toggle(p.id)} className="text-indigo-500 hover:text-indigo-700 transition cursor-pointer">
                      {p.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} className="text-gray-400" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
