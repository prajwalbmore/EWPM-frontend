import api from '../../config/api.js';

export const auditAPI = {
  getAuditLogs: async (params = {}) => {
    const response = await api.get('/audit', { params });
    return response.data;
  },

  getAuditLogById: async (id) => {
    const response = await api.get(`/audit/${id}`);
    return response.data;
  },

  getUserAuditLogs: async (userId, params = {}) => {
    const response = await api.get(`/audit/user/${userId}`, { params });
    return response.data;
  },

  getResourceAuditLogs: async (resourceType, resourceId, params = {}) => {
    const response = await api.get(`/audit/resource/${resourceType}/${resourceId}`, { params });
    return response.data;
  },
};

