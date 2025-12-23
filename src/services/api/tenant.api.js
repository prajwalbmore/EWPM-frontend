import api from '../../config/api.js';

export const tenantAPI = {
  getAllTenants: async (params = {}) => {
    const response = await api.get('/tenants', { params });
    return response.data;
  },

  getTenantById: async (id) => {
    const response = await api.get(`/tenants/${id}`);
    return response.data;
  },

  createTenant: async (tenantData) => {
    const response = await api.post('/tenants', tenantData);
    return response.data;
  },

  updateTenant: async (id, tenantData) => {
    const response = await api.put(`/tenants/${id}`, tenantData);
    return response.data;
  },

  deleteTenant: async (id) => {
    const response = await api.delete(`/tenants/${id}`);
    return response.data;
  },

  suspendTenant: async (id) => {
    const response = await api.post(`/tenants/${id}/suspend`);
    return response.data;
  },

  activateTenant: async (id) => {
    const response = await api.post(`/tenants/${id}/activate`);
    return response.data;
  },

  getTenantStats: async (id) => {
    const response = await api.get(`/tenants/${id}/stats`);
    return response.data;
  },

  getGlobalStats: async () => {
    const response = await api.get('/tenants/stats/global');
    return response.data;
  },

  getTenantSettings: async (id) => {
    const response = await api.get(`/tenants/${id}/settings`);
    return response.data;
  },

  updateTenantSettings: async (id, settings) => {
    const response = await api.put(`/tenants/${id}/settings`, settings);
    return response.data;
  },
};

