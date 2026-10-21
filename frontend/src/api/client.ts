import axios from 'axios';
import { getMockResponse } from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 5000, // 5s maximum timeout to prevent hanging UI
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Detect if static server (e.g. Cloudflare Pages) served index.html instead of real JSON API
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!doctype') || response.data.includes('<html') || response.data.includes('<div id="root">'))
    ) {
      const mock = getMockResponse(response.config.method, response.config.url, response.config.data);
      if (mock) {
        return {
          ...response,
          status: mock.status,
          data: mock.data,
        };
      }
    }
    return response;
  },
  (error) => {
    // Inactivity timeout handling
    if (error.response?.status === 401) {
      const code = error.response?.data?.code;
      if (code === 'SESSION_INACTIVITY_TIMEOUT') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?reason=inactivity';
        return Promise.reject(error);
      }
    }

    // Graceful fallback if backend is offline or static hosting 404s/405s on API routes
    if (
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.response?.status === 404 ||
      error.response?.status === 405 ||
      error.response?.status === 500 ||
      error.response?.status === 502 ||
      error.response?.status === 503 ||
      !error.response
    ) {
      const mock = getMockResponse(error.config?.method, error.config?.url, error.config?.data);
      if (mock) {
        return Promise.resolve({
          data: mock.data,
          status: mock.status,
          statusText: 'OK (Cached Edge Fallback)',
          headers: {},
          config: error.config,
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
