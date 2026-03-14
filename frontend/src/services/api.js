import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
};

// Thread endpoints
export const threadAPI = {
  getAll: (params) => api.get('/threads', { params }),
  getById: (id) => api.get(`/threads/${id}`),
  create: (data) => api.post('/threads', data),
  update: (id, data) => api.put(`/threads/${id}`, data),
  delete: (id) => api.delete(`/threads/${id}`),
  pin: (id) => api.patch(`/threads/${id}/pin`),
  getStats: () => api.get('/threads/stats')
};

// Category endpoints
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

// Reply endpoints
export const replyAPI = {
  getByThread: (threadId, params) => api.get(`/replies/${threadId}`, { params }),
  create: (threadId, data) => api.post(`/replies/${threadId}`, data),
  update: (id, data) => api.put(`/replies/${id}`, data),
  delete: (id) => api.delete(`/replies/${id}`),
  upvote: (id) => api.post(`/replies/${id}/upvote`),
  downvote: (id) => api.post(`/replies/${id}/downvote`)
};

// User endpoints
export const userAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile/update', data),
  getThreads: (id, params) => api.get(`/users/${id}/threads`, { params }),
  getAll: (params) => api.get('/users', { params }),
  updateRole: (id, data) => api.patch(`/users/${id}/role`, data)
};

export default api;
