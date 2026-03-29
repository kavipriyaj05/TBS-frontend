// ═══ FILE: src/api/showApi.js ═══
// Show API calls — Jeyanth
import axiosInstance from './axiosInstance';

export const showApi = {
  getShowsByMovie: (movieId) => axiosInstance.get(`/shows?movieId=${movieId}`),
  getShowById: (id) => axiosInstance.get(`/shows/${id}`),
  getAvailableSeats: (showId) => axiosInstance.get(`/shows/${showId}/seats`),
};

export default showApi;
