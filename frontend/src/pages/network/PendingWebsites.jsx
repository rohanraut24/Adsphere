import { useEffect, useState } from 'react'
import { networkApi } from '../../api'
import Badge from '../../components/Badge'
import { CheckCircle, XCircle, Globe } from 'lucide-react'

export default function PendingWebsites() {
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => networkApi.getPendingWebsites().then((r) => { setWebsites(r.data); setLoading(false) })
  useEffect(() => { load() }, [])

  const action = async (fn, id) => { await fn(id); load() }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Website Approvals</h1>
        <p className="text-sm text-gray-500 mt-0.5">{websites.length} pending website{websites.length !== 1 ? 's' : ''} awaiting review</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="animate-pulse p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}</div>
        ) : websites.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <CheckCircle size={40} className="text-emerald-200 mb-3" />
            <p className="text-gray-500 font-medium">All caught up!</p>
            <p className="text-gray-400 text-sm mt-1">No pending websites to review</p>
          </div>
        ) : (
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="th text-left">Website</th>
              <th className="th text-left">Publisher</th>
              <th className="th text-left">Category</th>
              <th className="th text-left">Status</th>
              <th className="th text-left">Submitted</th>
              <th className="th text-left">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {websites.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <Globe size={14} className="text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{w.name}</p>
                        <a href={w.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline">{w.url}</a>
                      </div>
                    </div>
                  </td>
                  <td className="td text-sm text-gray-600">{w.publisherEmail}</td>
                  <td className="td"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{w.category}</span></td>
                  <td className="td"><Badge status={w.status} /></td>
                  <td className="td text-xs text-gray-500">{new Date(w.createdAt).toLocaleDateString()}</td>
                  <td className="td">
                    <div className="flex gap-1.5">
                      <button onClick={() => action(networkApi.approveWebsite, w.id)}
                        className="flex items-center gap-1 btn-success">
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button onClick={() => action(networkApi.rejectWebsite, w.id)}
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
