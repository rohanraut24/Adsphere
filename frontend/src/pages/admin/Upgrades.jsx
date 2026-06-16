import { useEffect, useState } from 'react'
import { adminApi } from '../../api'
import Badge from '../../components/Badge'
import { CheckCircle, XCircle, ShieldCheck } from 'lucide-react'

export default function Upgrades() {
  const [requests, setRequests] = useState([])
  const [notes, setNotes] = useState({})
  const [loading, setLoading] = useState(true)

  const load = () => adminApi.getPendingUpgrades().then((r) => { setRequests(r.data); setLoading(false) })
  useEffect(() => { load() }, [])

  const review = async (id, decision) => {
    await adminApi.reviewUpgrade(id, { decision, reviewNote: notes[id] || '' })
    load()
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Upgrade Requests</h1>
        <p className="text-sm text-gray-500 mt-0.5">{requests.length} pending request{requests.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}</div>
        ) : requests.length === 0 ? (
          <div className="card flex flex-col items-center py-20 text-center">
            <ShieldCheck size={40} className="text-emerald-200 mb-3" />
            <p className="text-gray-500 font-medium">No pending requests</p>
            <p className="text-gray-400 text-sm mt-1">All upgrade requests have been reviewed</p>
          </div>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {r.userEmail?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{r.userEmail}</p>
                      <span className="text-gray-400 text-xs">→</span>
                      <Badge status={r.requestedRole} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{r.reason}</p>
                    <p className="text-xs text-gray-400 mt-1">Submitted {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge status={r.status} />
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <input
                    placeholder="Add a review note (optional)…"
                    value={notes[r.id] || ''}
                    onChange={(e) => setNotes((p) => ({ ...p, [r.id]: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 w-full"
                  />
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => review(r.id, 'APPROVED')}
                    className="flex items-center gap-1.5 btn-success px-4 py-2 text-sm">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button onClick={() => review(r.id, 'REJECTED')}
                    className="flex items-center gap-1.5 btn-danger px-4 py-2 text-sm">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
