import axios from 'axios';

/**
 * api.js — Axios base instance.
 *
 * All API service files should import and use this instance
 * instead of calling axios directly. This centralizes:
 *   - Base URL configuration
 *   - Auth token injection (via interceptors)
 *   - Global error handling
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──────────────────────────────────────────
// Attach auth token to every request (when implemented)
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ─────────────────────────────────────────
// Handle global errors (e.g. 401 redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Handle 401, 403, 500 globally
    return Promise.reject(error);
  },
);

export default api;
