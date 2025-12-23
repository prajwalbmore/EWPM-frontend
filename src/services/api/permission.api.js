import api from '../../config/api.js';

export const permissionAPI = {
  getManageableUsers: async () => {
    const response = await api.get('/permissions/manageable');
    return response.data;
  },

  getUserPermissions: async (userId) => {
    const response = await api.get(`/permissions/user/${userId}`);
    return response.data;
  },

  updateUserPermissions: async (userId, permissions) => {
    const response = await api.put(`/permissions/user/${userId}`, { permissions });
    return response.data;
  },

  resetUserPermissions: async (userId) => {
    const response = await api.post(`/permissions/user/${userId}/reset`);
    return response.data;
  },
};
