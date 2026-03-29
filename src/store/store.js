// ═══ FILE: src/store/store.js ═══
// Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
  },
});

export default store;
