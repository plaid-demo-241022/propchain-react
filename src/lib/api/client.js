import axios from 'axios';
import { auth } from '@/lib/firebase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken(true);
          err.config.headers.Authorization = `Bearer ${token}`;
          return api(err.config);
        } catch {
          await auth.signOut();
          window.location.href = '/signin';
        }
      }
    }
    return Promise.reject(new Error(err.response?.data?.message || err.message));
  }
);

export default api;
