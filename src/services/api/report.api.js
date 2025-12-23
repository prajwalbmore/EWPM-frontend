import api from '../../config/api.js';

export const reportAPI = {
  getProductivityReport: async (params = {}) => {
    const response = await api.get('/reports/productivity', { params });
    return response.data;
  },

  getProjectCompletionReport: async (params = {}) => {
    const response = await api.get('/reports/project-completion', { params });
    return response.data;
  },

  getTimeTrackingReport: async (params = {}) => {
    const response = await api.get('/reports/time-tracking', { params });
    return response.data;
  },

  getUserActivityReport: async (params = {}) => {
    const response = await api.get('/reports/user-activity', { params });
    return response.data;
  },

  getTaskStatusReport: async (params = {}) => {
    const response = await api.get('/reports/task-status', { params });
    return response.data;
  },

  getBudgetReport: async (params = {}) => {
    const response = await api.get('/reports/budget', { params });
    return response.data;
  },

  getTaskTrendsReport: async (params = {}) => {
    const response = await api.get('/reports/task-trends', { params });
    return response.data;
  },

  getPriorityReport: async (params = {}) => {
    const response = await api.get('/reports/priority', { params });
    return response.data;
  },

  getTeamUtilizationReport: async (params = {}) => {
    const response = await api.get('/reports/team-utilization', { params });
    return response.data;
  },
};

