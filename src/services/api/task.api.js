import api from '../../config/api.js';

export const taskAPI = {
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  addComment: async (id, comment) => {
    const response = await api.post(`/tasks/${id}/comments`, { content: comment });
    return response.data;
  },

  updateComment: async (taskId, commentId, content) => {
    const response = await api.put(`/tasks/${taskId}/comments/${commentId}`, { content });
    return response.data;
  },

  deleteComment: async (taskId, commentId) => {
    const response = await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    return response.data;
  },
};

