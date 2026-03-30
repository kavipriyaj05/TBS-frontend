// ═══ FILE: src/api/adminApi.js ═══
// Admin API calls — aligned with backend AdminController + public endpoints
import axiosInstance from './axiosInstance';

export const adminApi = {
  // Dashboard
  getDashboardStats: () => axiosInstance.get('/admin/dashboard/stats'),

  // Movies (Admin)
  createMovie: (movieData) => axiosInstance.post('/admin/movies', movieData),
  updateMovie: (id, movieData) => axiosInstance.put(`/admin/movies/${id}`, movieData),
  deleteMovie: (id) => axiosInstance.delete(`/admin/movies/${id}`),

  // Theatres — create is admin, list is public
  getAllTheatres: (city) => axiosInstance.get('/theatres', { params: city ? { city } : {} }),
  createTheatre: (theatreData) => axiosInstance.post('/admin/theatres', theatreData),

  // Screens (Admin) — POST /admin/screens with { theatreId, screenName, totalSeats }
  createScreen: (screenData) => axiosInstance.post('/admin/screens', screenData),

  // Shows — create/update is admin, list is public
  getAllShows: (params) => axiosInstance.get('/shows', { params }),
  createShow: (showData) => axiosInstance.post('/admin/shows', showData),
  updateShow: (id, showData) => axiosInstance.put(`/admin/shows/${id}`, showData),

  // Seats (Admin) — bulk create for a screen
  bulkCreateSeats: (screenId, seatData) =>
    axiosInstance.post(`/admin/screens/${screenId}/seats`, seatData),
};

export default adminApi;
