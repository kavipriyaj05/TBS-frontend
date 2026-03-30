// ═══ FILE: src/api/movieApi.js ═══
// Movie API calls — Kavi
import axiosInstance from './axiosInstance';

export const movieApi = {
  getAllMovies: (params) => axiosInstance.get('/movies', { params }),
  getMovieById: (id) => axiosInstance.get(`/movies/${id}`),
  searchMovies: (query) => axiosInstance.get('/movies/search', { params: { q: query } }),
};

export default movieApi;
