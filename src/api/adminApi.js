// ═══ FILE: src/api/adminApi.js ═══
// Admin API calls — Jeyanth
import axiosInstance from './axiosInstance';

export const adminApi = {
  // Movies
  createMovie: (movieData) => axiosInstance.post('/admin/movies', movieData),
  updateMovie: (id, movieData) => axiosInstance.put(`/admin/movies/${id}`, movieData),
  deleteMovie: (id) => axiosInstance.delete(`/admin/movies/${id}`),

  // Theatres
  getAllTheatres: () => axiosInstance.get('/admin/theatres'),
  createTheatre: (theatreData) => axiosInstance.post('/admin/theatres', theatreData),
  updateTheatre: (id, theatreData) => axiosInstance.put(`/admin/theatres/${id}`, theatreData),
  deleteTheatre: (id) => axiosInstance.delete(`/admin/theatres/${id}`),

  // Screens
  getScreensByTheatre: (theatreId) => axiosInstance.get(`/admin/theatres/${theatreId}/screens`),
  createScreen: (theatreId, screenData) =>
    axiosInstance.post(`/admin/theatres/${theatreId}/screens`, screenData),

  // Shows
  getAllShows: (params) => axiosInstance.get('/admin/shows', { params }),
  createShow: (showData) => axiosInstance.post('/admin/shows', showData),
  updateShow: (id, showData) => axiosInstance.put(`/admin/shows/${id}`, showData),
  cancelShow: (id) => axiosInstance.put(`/admin/shows/${id}/cancel`),

  // Dashboard stats
  getDashboardStats: () => axiosInstance.get('/admin/dashboard/stats'),
  getAllBookings: (params) => axiosInstance.get('/admin/bookings', { params }),
};

export default adminApi;
