import { useEffect, useState } from 'react'
import { networkApi } from '../../api'
import Badge from '../../components/Badge'
import { CheckCircle, XCircle, Megaphone } from 'lucide-react'

export default function PendingCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => networkApi.getPendingCampaigns().then((r) => { setCampaigns(r.data); setLoading(false) })
  useEffect(() => { load() }, [])

  const action = async (fn, id) => { await fn(id); load() }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Campaign Approvals</h1>
        <p className="text-sm text-gray-500 mt-0.5">{campaigns.length} pending campaign{campaigns.length !== 1 ? 's' : ''} awaiting review</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="animate-pulse p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}</div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <CheckCircle size={40} className="text-emerald-200 mb-3" />
            <p className="text-gray-500 font-medium">All caught up!</p>
            <p className="text-gray-400 text-sm mt-1">No pending campaigns to review</p>
          </div>
        ) : (
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="th text-left">Campaign</th>
              <th className="th text-left">Advertiser</th>
              <th className="th text-right">Budget</th>
              <th className="th text-right">CPC Bid</th>
              <th className="th text-left">Dates</th>
              <th className="th text-left">Status</th>
              <th className="th text-left">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                        <Megaphone size={14} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{c.name}</p>
                        {c.description && <p className="text-xs text-gray-400 truncate max-w-[160px]">{c.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="td text-sm text-gray-600">{c.advertiserEmail}</td>
                  <td className="td text-right font-semibold">${Number(c.budget).toLocaleString()}</td>
                  <td className="td text-right text-gray-600">${c.cpcBid}</td>
                  <td className="td text-xs text-gray-500">{c.startDate}<br />{c.endDate}</td>
                  <td className="td"><Badge status={c.status} /></td>
                  <td className="td">
                    <div className="flex gap-1.5">
                      <button onClick={() => action(networkApi.approveCampaign, c.id)}
                        className="flex items-center gap-1 btn-success">
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button onClick={() => action(networkApi.rejectCampaign, c.id)}
                        className="flex items-center gap-1 btn-danger">
                        <XCircle size={12} /> Reject
                      </button>
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
