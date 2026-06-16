import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { advertiserApi } from '../../api'
import Badge from '../../components/Badge'
import { Plus, Search, Megaphone } from 'lucide-react'

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')

  const load = () => advertiserApi.getCampaigns().then((r) => setCampaigns(r.data))
  useEffect(() => { load() }, [])

  const action = async (fn, id) => { await fn(id); load() }

  const STATUSES = ['ALL', 'DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'PAUSED', 'COMPLETED', 'REJECTED']

  const visible = campaigns
    .filter((c) => filter === 'ALL' || c.status === filter)
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-0.5">{campaigns.length} total campaign{campaigns.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/advertiser/campaigns/new" className="btn-primary flex items-center gap-2">
          <Plus size={15} /> New Campaign
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns…"
            className="border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white w-52"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${filter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Megaphone size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No campaigns found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or create a new campaign</p>
          </div>
        ) : (
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="th text-left">Campaign</th>
              <th className="th text-left">Status</th>
              <th className="th text-right">Budget</th>
              <th className="th text-right">CPC Bid</th>
              <th className="th text-left">Dates</th>
              <th className="th text-left">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {visible.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="td">
                    <Link to={`/advertiser/campaigns/${c.id}`} className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                      {c.name}
                    </Link>
                    {c.description && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{c.description}</p>}
                  </td>
                  <td className="td"><Badge status={c.status} /></td>
                  <td className="td text-right font-semibold text-gray-900">${Number(c.budget).toLocaleString()}</td>
                  <td className="td text-right text-gray-600">${c.cpcBid}</td>
                  <td className="td text-xs text-gray-500">{c.startDate}<br />{c.endDate}</td>
                  <td className="td">
                    <div className="flex gap-1.5 flex-wrap">
                      {c.status === 'DRAFT' && (<>
                        <Link to={`/advertiser/campaigns/${c.id}/edit`} className="btn-secondary text-xs px-2.5 py-1">Edit</Link>
                        <button onClick={() => action(advertiserApi.submitCampaign, c.id)} className="btn-success">Submit</button>
                        <button onClick={() => action(advertiserApi.deleteCampaign, c.id)} className="btn-danger">Delete</button>
                      </>)}
                      {c.status === 'ACTIVE' && (
                        <button onClick={() => action(advertiserApi.pauseCampaign, c.id)} className="btn-warn">Pause</button>
                      )}
                      {c.status === 'PAUSED' && (
                        <button onClick={() => action(advertiserApi.resumeCampaign, c.id)} className="btn-success">Resume</button>
                      )}
                      <Link to={`/advertiser/campaigns/${c.id}`} className="btn-secondary text-xs px-2.5 py-1">View</Link>
                    </div>
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
