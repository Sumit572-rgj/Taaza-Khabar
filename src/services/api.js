import axios from 'axios';

// Base API URL (from environment or fallback)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid session and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ---------------- AUTH ----------------
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// ---------------- ARTICLES ----------------
export const articlesAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getBreaking: () => api.get('/articles/breaking'),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`)
};

// ---------------- SUBSCRIPTIONS ----------------
export const subscriptionsAPI = {
  // Public plans
  getPlans: () => api.get('/subscriptions/plans'),

  // Current user subscription
  getMySubscription: () => api.get('/subscriptions/my-subscription'),
  upgrade: (planType) => api.post('/subscriptions/upgrade', { planType }),
  cancel: () => api.post('/subscriptions/cancel'),

  // Admin endpoints
  getAll: () => api.get('/subscriptions'),
  getUserSubscription: (userId) => api.get(`/subscriptions/user/${userId}`),
  update: (subscriptionId, data) => api.put(`/subscriptions/${subscriptionId}`, data),
  delete: (subscriptionId) => api.delete(`/subscriptions/${subscriptionId}`)
};

// ---------------- USERS ----------------
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  assignRole: (id, role) => api.post(`/users/${id}/assign-role`, { role }),
  getStats: () => api.get('/users/stats/dashboard')
};

export default api;
