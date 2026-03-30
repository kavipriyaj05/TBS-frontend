// ═══ FILE: src/api/paymentApi.js ═══
// Payment API calls — aligned with backend PaymentController
import axiosInstance from './axiosInstance';

export const paymentApi = {
  // POST /api/payments/initiate — creates PENDING payment, returns transactionId
  initiatePayment: (bookingId) =>
    axiosInstance.post('/payments/initiate', { bookingId }),

  // POST /api/payments/webhook — simulated gateway callback
  simulateWebhook: (transactionId, status) =>
    axiosInstance.post('/payments/webhook', { transactionId, status }),

  // GET /api/payments/{bookingId} — get payment status for a booking
  getPaymentStatus: (bookingId) =>
    axiosInstance.get(`/payments/${bookingId}`),
};

export default paymentApi;
