// ═══ FILE: src/api/bookingApi.js ═══
// Booking API calls — aligned with backend BookingController
import axiosInstance from './axiosInstance';

export const bookingApi = {
  createBooking: (bookingData) => axiosInstance.post('/bookings', bookingData),
  getMyBookings: () => axiosInstance.get('/bookings/my'),
  confirmBooking: (id) => axiosInstance.post(`/bookings/${id}/confirm`),
  cancelBooking: (id) => axiosInstance.post(`/bookings/${id}/cancel`),
  getAllBookings: () => axiosInstance.get('/bookings/admin/all'),
};

export default bookingApi;
