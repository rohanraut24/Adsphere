import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const TITLES = {
  '/advertiser': 'Dashboard',
  '/advertiser/campaigns': 'My Campaigns',
  '/advertiser/campaigns/new': 'New Campaign',
  '/publisher': 'Dashboard',
  '/publisher/websites': 'My Websites',
  '/publisher/websites/new': 'Register Website',
  '/publisher/placements': 'Placements',
  '/network/websites': 'Website Approvals',
  '/network/campaigns': 'Campaign Approvals',
  '/admin': 'Platform Statistics',
  '/admin/users': 'User Management',
  '/admin/upgrades': 'Upgrade Requests',
}

export default function Layout() {
  const { pathname } = useLocation()
  const title = Object.entries(TITLES).findLast(([k]) => pathname.startsWith(k))?.[1] || 'AdSphere'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-8 shrink-0">
          <h1 className="text-sm font-semibold text-gray-800">{title}</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-gray-500">Connected to backend</span>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
