import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { publisherApi } from '../../api'
import Badge from '../../components/Badge'
import { Plus, Globe, Search } from 'lucide-react'

export default function WebsiteList() {
  const [websites, setWebsites] = useState([])
  const [search, setSearch] = useState('')

  const load = () => publisherApi.getWebsites().then((r) => setWebsites(r.data))
  useEffect(() => { load() }, [])

  const del = async (id) => { await publisherApi.deleteWebsite(id); load() }

  const visible = websites.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) || w.url.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Websites</h1>
          <p className="text-sm text-gray-500 mt-0.5">{websites.length} registered website{websites.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/publisher/websites/new" className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Register Website
        </Link>
      </div>

      <div className="relative w-64">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search websites…"
          className="border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white w-full" />
      </div>

      <div className="card overflow-hidden">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Globe size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No websites found</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">Register your first website to start displaying ads</p>
            <Link to="/publisher/websites/new" className="btn-primary text-xs px-3 py-1.5">Register Website</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="th text-left">Website</th>
              <th className="th text-left">Category</th>
              <th className="th text-left">Status</th>
              <th className="th text-left">Registered</th>
              <th className="th text-left">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {visible.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="td">
                    <Link to={`/publisher/websites/${w.id}`} className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">{w.name}</Link>
                    <p className="text-xs text-gray-400 mt-0.5">{w.url}</p>
                  </td>
                  <td className="td">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{w.category}</span>
                  </td>
                  <td className="td"><Badge status={w.status} /></td>
                  <td className="td text-xs text-gray-500">{new Date(w.createdAt).toLocaleDateString()}</td>
                  <td className="td">
                    <div className="flex gap-1.5">
                      <Link to={`/publisher/websites/${w.id}`} className="btn-secondary text-xs px-2.5 py-1">View</Link>
                      <Link to={`/publisher/websites/${w.id}/edit`} className="btn-secondary text-xs px-2.5 py-1">Edit</Link>
                      <button onClick={() => del(w.id)} className="btn-danger">Delete</button>
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
