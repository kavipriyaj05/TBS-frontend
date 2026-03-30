// ═══ FILE: src/api/authApi.js ═══
// Auth API calls — Kavi
import axiosInstance from './axiosInstance';

export const authApi = {
  register: (userData) => axiosInstance.post('/auth/register', userData),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  refresh: (refreshToken) => axiosInstance.post('/auth/refresh', { refreshToken }),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/profile'),
};

export default authApi;
