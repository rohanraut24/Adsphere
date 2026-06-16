import { useEffect, useState } from 'react'
import { publisherApi } from '../../api'
import { ToggleLeft, ToggleRight, LayoutGrid } from 'lucide-react'

export default function Placements() {
  const [placements, setPlacements] = useState([])
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const wRes = await publisherApi.getWebsites()
    setWebsites(wRes.data)
    const all = await Promise.all(wRes.data.map((w) => publisherApi.getPlacements(w.id).then((r) => r.data.map((p) => ({ ...p, _websiteName: w.name })))))
    setPlacements(all.flat())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggle = async (pid) => {
    await publisherApi.togglePlacement(pid)
    load()
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded-2xl" />

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">All Placements</h1>
        <p className="text-sm text-gray-500 mt-0.5">{placements.length} total placement{placements.length !== 1 ? 's' : ''} across {websites.length} website{websites.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="card overflow-hidden">
        {placements.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <LayoutGrid size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No placements yet</p>
            <p className="text-gray-400 text-sm mt-1">Go to an approved website to add a placement</p>
          </div>
        ) : (
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="th text-left">Website</th>
              <th className="th text-left">Campaign</th>
              <th className="th text-center">Status</th>
              <th className="th text-left">Created</th>
              <th className="th text-center">Toggle</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {placements.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="td">
                    <p className="font-medium text-gray-900">{p._websiteName}</p>
                    <p className="text-xs text-gray-400">{p.websiteUrl}</p>
                  </td>
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
