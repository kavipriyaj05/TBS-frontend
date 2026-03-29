// ═══ FILE: src/api/bookingApi.js ═══
// Booking API calls — Jeyanth
import axiosInstance from './axiosInstance';

export const bookingApi = {
  createBooking: (bookingData) => axiosInstance.post('/bookings', bookingData),
  getMyBookings: () => axiosInstance.get('/bookings/my'),
  getBookingById: (id) => axiosInstance.get(`/bookings/${id}`),
  cancelBooking: (id) => axiosInstance.put(`/bookings/${id}/cancel`),
  confirmPayment: (bookingId, paymentData) =>
    axiosInstance.post(`/bookings/${bookingId}/pay`, paymentData),
};

export default bookingApi;
