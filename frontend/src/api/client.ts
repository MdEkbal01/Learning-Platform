import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { getMockResponse } from './mockData';

// Determine if we are running on a static hosting environment without a backend (such as Cloudflare Pages)
const isStaticEdgeEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  if (hostname.endsWith('pages.dev') || hostname.endsWith('workers.dev')) return true;
  if (!import.meta.env.VITE_API_URL && hostname !== 'localhost' && hostname !== '127.0.0.1') return true;
  return false;
};

// Retrieve default Axios adapter (supports browser fetch/XHR)
const defaultAdapter = axios.getAdapter(axios.defaults.adapter || 'xhr');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 3000, // Responsive 3s timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    // 1. Instant Edge Static Mock Resolution:
    // On Cloudflare Pages, there is no Express server at /api. Rather than making redundant
    // network round-trips over the internet that download 11KB of HTML or return 405s,
    // resolve the request immediately in 10ms for instant page loading and silky smooth transitions.
    if (isStaticEdgeEnvironment()) {
      const mock = getMockResponse(config.method, config.url, config.data);
      if (mock) {
        // Micro-yield (10ms) allows React transitions to batch smoothly
        await new Promise((resolve) => setTimeout(resolve, 10));
        return {
          data: mock.data,
          status: mock.status,
          statusText: 'OK (Instant Edge Mock)',
          headers: {},
          config,
        };
      }
    }

    // 2. Normal Remote or Localhost Development:
    try {
      const response = await defaultAdapter(config);

      // Detect if static server (e.g. Cloudflare Pages or Vite fallback) served index.html instead of real JSON API
      if (
        typeof response.data === 'string' &&
        (response.data.includes('<!doctype') || response.data.includes('<html') || response.data.includes('<div id="root">'))
      ) {
        const mock = getMockResponse(config.method, config.url, config.data);
        if (mock) {
          return {
            ...response,
            status: mock.status,
            data: mock.data,
          };
        }
      }

      return response;
    } catch (error: any) {
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

      // Fallback if local backend is offline or static hosting returns error
      const mock = getMockResponse(config.method, config.url, config.data);
      if (mock) {
        return {
          data: mock.data,
          status: mock.status,
          statusText: 'OK (Edge Fallback)',
          headers: {},
          config,
        };
      }

      throw error;
    }
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
