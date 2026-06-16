import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import Login from './pages/Login'
import Register from './pages/Register'

import AdvertiserDashboard from './pages/advertiser/Dashboard'
import CampaignList from './pages/advertiser/CampaignList'
import CampaignDetail from './pages/advertiser/CampaignDetail'
import CampaignForm from './pages/advertiser/CampaignForm'

import PublisherDashboard from './pages/publisher/Dashboard'
import WebsiteList from './pages/publisher/WebsiteList'
import WebsiteDetail from './pages/publisher/WebsiteDetail'
import WebsiteForm from './pages/publisher/WebsiteForm'
import Placements from './pages/publisher/Placements'

import PendingWebsites from './pages/network/PendingWebsites'
import PendingCampaigns from './pages/network/PendingCampaigns'

import AdminStats from './pages/admin/Stats'
import Users from './pages/admin/Users'
import Upgrades from './pages/admin/Upgrades'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute role="ADVERTISER" />}>
            <Route element={<Layout />}>
              <Route path="/advertiser" element={<AdvertiserDashboard />} />
              <Route path="/advertiser/campaigns" element={<CampaignList />} />
              <Route path="/advertiser/campaigns/new" element={<CampaignForm />} />
              <Route path="/advertiser/campaigns/:id" element={<CampaignDetail />} />
              <Route path="/advertiser/campaigns/:id/edit" element={<CampaignForm />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role="PUBLISHER" />}>
            <Route element={<Layout />}>
              <Route path="/publisher" element={<PublisherDashboard />} />
              <Route path="/publisher/websites" element={<WebsiteList />} />
              <Route path="/publisher/websites/new" element={<WebsiteForm />} />
              <Route path="/publisher/websites/:id" element={<WebsiteDetail />} />
              <Route path="/publisher/websites/:id/edit" element={<WebsiteForm />} />
              <Route path="/publisher/placements" element={<Placements />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role="NETWORK_ADMIN" />}>
            <Route element={<Layout />}>
              <Route path="/network/websites" element={<PendingWebsites />} />
              <Route path="/network/campaigns" element={<PendingCampaigns />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role="SUPER_ADMIN" />}>
            <Route element={<Layout />}>
              <Route path="/admin" element={<AdminStats />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/upgrades" element={<Upgrades />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
