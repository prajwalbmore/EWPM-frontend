import api from '../../config/api.js';

export const projectAPI = {
  getProjects: async (params = {}) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  addProjectMember: async (id, memberData) => {
    const response = await api.post(`/projects/${id}/members`, memberData);
    return response.data;
  },

  removeProjectMember: async (id, userId) => {
    const response = await api.delete(`/projects/${id}/members/${userId}`);
    return response.data;
  },
};

