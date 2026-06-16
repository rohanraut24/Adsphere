import { useEffect, useState } from 'react'
import { adminApi } from '../../api'
import Badge from '../../components/Badge'
import { Users, Search, UserX, UserCheck } from 'lucide-react'

const ROLES = ['ALL', 'SUPER_ADMIN', 'NETWORK_ADMIN', 'PUBLISHER', 'ADVERTISER']

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [role, setRole] = useState('ALL')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = (r) => {
    setLoading(true)
    const req = r === 'ALL' ? adminApi.getUsers() : adminApi.getUsersByRole(r)
    req.then((res) => { setUsers(res.data); setLoading(false) })
  }

  useEffect(() => { load(role) }, [role])

  const action = async (fn, id) => { await fn(id); load(role) }

  const visible = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const getInitials = (name) => name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">User Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">{users.length} user{users.length !== 1 ? 's' : ''} {role !== 'ALL' ? `with role ${role}` : 'total'}</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…"
            className="border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white w-64" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {ROLES.map((r) => (
            <button key={r} onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${role === r ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {r.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="animate-pulse p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}</div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Users size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="th text-left">User</th>
              <th className="th text-left">Role</th>
              <th className="th text-left">Status</th>
              <th className="th text-left">Joined</th>
              <th className="th text-left">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {visible.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {getInitials(u.fullName)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{u.fullName}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td"><Badge status={u.role} /></td>
                  <td className="td"><Badge status={u.status} /></td>
                  <td className="td text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="td">
                    <div className="flex gap-1.5">
                      {u.status !== 'SUSPENDED' ? (
                        <button onClick={() => action(adminApi.suspendUser, u.id)}
                          className="flex items-center gap-1 btn-danger">
                          <UserX size={12} /> Suspend
                        </button>
                      ) : (
                        <button onClick={() => action(adminApi.activateUser, u.id)}
                          className="flex items-center gap-1 btn-success">
                          <UserCheck size={12} /> Activate
                        </button>
                      )}
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
