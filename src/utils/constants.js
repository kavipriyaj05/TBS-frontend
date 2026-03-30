// ═══ FILE: src/utils/constants.js ═══
// Shared constants for the entire frontend application

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://ticketmanagementsystem-o3gk.onrender.com/api';

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
};

export const SEAT_TYPES = {
  STANDARD: 'STANDARD',
  PREMIUM: 'PREMIUM',
  RECLINER: 'RECLINER',
};

export const SEAT_STATUS = {
  LOCKED: 'LOCKED',
  CONFIRMED: 'CONFIRMED',
  RELEASED: 'RELEASED',
};

export const SHOW_STATUS = {
  SCHEDULED: 'SCHEDULED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
];

export const LANGUAGES = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Bengali',
  'Marathi',
];
