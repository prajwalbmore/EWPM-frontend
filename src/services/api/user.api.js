import api from '../../config/api.js';

export const userAPI = {
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },

  // Profile methods
  getCurrentUserProfile: async () => {
    const response = await api.get('/users/profile/me');
    return response.data;
  },

  updateCurrentUserProfile: async (profileData) => {
    const response = await api.put('/users/profile/me', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/users/profile/change-password', passwordData);
    return response.data;
  },
};

