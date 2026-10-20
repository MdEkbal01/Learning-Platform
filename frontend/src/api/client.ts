import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const code = error.response?.data?.code;
      if (code === 'SESSION_INACTIVITY_TIMEOUT') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?reason=inactivity';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
