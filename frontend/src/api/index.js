import api from './axios'

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

export const advertiserApi = {
  getCampaigns: () => api.get('/advertiser/campaigns'),
  getCampaign: (id) => api.get(`/advertiser/campaigns/${id}`),
  createCampaign: (data) => api.post('/advertiser/campaigns', data),
  updateCampaign: (id, data) => api.put(`/advertiser/campaigns/${id}`, data),
  deleteCampaign: (id) => api.delete(`/advertiser/campaigns/${id}`),
  submitCampaign: (id) => api.put(`/advertiser/campaigns/${id}/submit`),
  pauseCampaign: (id) => api.put(`/advertiser/campaigns/${id}/pause`),
  resumeCampaign: (id) => api.put(`/advertiser/campaigns/${id}/resume`),
  getCreatives: (id) => api.get(`/advertiser/campaigns/${id}/creatives`),
  addCreative: (id, data) => api.post(`/advertiser/campaigns/${id}/creatives`, data),
  deleteCreative: (cid, rid) => api.delete(`/advertiser/campaigns/${cid}/creatives/${rid}`),
  getPlacements: (id) => api.get(`/advertiser/campaigns/${id}/placements`),
  getSpend: () => api.get('/advertiser/spend'),
  getTransactions: () => api.get('/advertiser/transactions'),
  getAnalytics: (id, from, to) => api.get(`/advertiser/campaigns/${id}/analytics`, { params: { from, to } }),
  getDailyAnalytics: (id, from, to) => api.get(`/advertiser/campaigns/${id}/analytics/daily`, { params: { from, to } }),
}

export const publisherApi = {
  getWebsites: () => api.get('/publisher/websites'),
  getWebsite: (id) => api.get(`/publisher/websites/${id}`),
  createWebsite: (data) => api.post('/publisher/websites', data),
  updateWebsite: (id, data) => api.put(`/publisher/websites/${id}`, data),
  deleteWebsite: (id) => api.delete(`/publisher/websites/${id}`),
  getPlacements: (websiteId) => api.get(`/publisher/websites/${websiteId}/placements`),
  createPlacement: (data) => api.post('/publisher/placements', data),
  togglePlacement: (id) => api.put(`/publisher/placements/${id}/toggle`),
  getEarnings: () => api.get('/publisher/earnings'),
  getTransactions: () => api.get('/publisher/transactions'),
  getAnalytics: (id, from, to) => api.get(`/publisher/websites/${id}/analytics`, { params: { from, to } }),
  getDailyAnalytics: (id, from, to) => api.get(`/publisher/websites/${id}/analytics/daily`, { params: { from, to } }),
  getUpgradeRequests: () => api.get('/publisher/upgrade-requests'),
  createUpgradeRequest: (data) => api.post('/publisher/upgrade-requests', data),
}

export const networkApi = {
  getPendingWebsites: () => api.get('/network/websites/pending'),
  approveWebsite: (id) => api.put(`/network/websites/${id}/approve`),
  rejectWebsite: (id) => api.put(`/network/websites/${id}/reject`),
  getPendingCampaigns: () => api.get('/network/campaigns/pending'),
  approveCampaign: (id) => api.put(`/network/campaigns/${id}/approve`),
  rejectCampaign: (id) => api.put(`/network/campaigns/${id}/reject`),
}

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getUsersByRole: (role) => api.get(`/admin/users/role/${role}`),
  suspendUser: (id) => api.put(`/admin/users/${id}/suspend`),
  activateUser: (id) => api.put(`/admin/users/${id}/activate`),
  getPendingUpgrades: () => api.get('/admin/upgrade-requests/pending'),
  reviewUpgrade: (id, data) => api.put(`/admin/upgrade-requests/${id}/review`, data),
}
