import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Megaphone, Globe, LayoutGrid,
  CheckSquare, Users, TrendingUp, LogOut, Zap, ShieldCheck,
} from 'lucide-react'

const NAV = {
  ADVERTISER: [
    { to: '/advertiser', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/advertiser/campaigns', label: 'Campaigns', icon: Megaphone },
  ],
  PUBLISHER: [
    { to: '/publisher', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/publisher/websites', label: 'Websites', icon: Globe },
    { to: '/publisher/placements', label: 'Placements', icon: LayoutGrid },
  ],
  NETWORK_ADMIN: [
    { to: '/network/websites', label: 'Website Approvals', icon: CheckSquare },
    { to: '/network/campaigns', label: 'Campaign Approvals', icon: Megaphone },
  ],
  SUPER_ADMIN: [
    { to: '/admin', label: 'Platform Stats', icon: TrendingUp, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/upgrades', label: 'Upgrade Requests', icon: ShieldCheck },
  ],
}

const ROLE_LABEL = {
  ADVERTISER: 'Advertiser',
  PUBLISHER: 'Publisher',
  NETWORK_ADMIN: 'Network Admin',
  SUPER_ADMIN: 'Super Admin',
}

const ROLE_COLOR = {
  ADVERTISER: 'text-orange-400',
  PUBLISHER: 'text-cyan-400',
  NETWORK_ADMIN: 'text-indigo-400',
  SUPER_ADMIN: 'text-violet-400',
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const items = NAV[user?.role] || []
  const initials = user?.email?.slice(0, 2).toUpperCase() || 'AD'

  return (
    <aside className="w-64 min-h-screen bg-gray-950 text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-2.5 border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">AdSphere</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
        <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Menu</p>
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
            <p className={`text-xs font-semibold ${ROLE_COLOR[user?.role]}`}>{ROLE_LABEL[user?.role]}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors cursor-pointer w-full"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
