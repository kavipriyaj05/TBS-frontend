// ═══ FILE: src/store/bookingSlice.js ═══
// Redux booking slice — manages booking + payment state
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingApi from '../api/bookingApi';
import paymentApi from '../api/paymentApi';

export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await bookingApi.createBooking(bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Booking failed'
      );
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getMyBookings();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bookings'
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingApi.cancelBooking(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Cancellation failed'
      );
    }
  }
);

export const confirmBooking = createAsyncThunk(
  'booking/confirm',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingApi.confirmBooking(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Confirmation failed'
      );
    }
  }
);

// Payment thunks
export const initiatePayment = createAsyncThunk(
  'booking/initiatePayment',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await paymentApi.initiatePayment(bookingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Payment initiation failed'
      );
    }
  }
);

export const simulateWebhook = createAsyncThunk(
  'booking/simulateWebhook',
  async ({ transactionId, status }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.simulateWebhook(transactionId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Payment processing failed'
      );
    }
  }
);

export const fetchPaymentStatus = createAsyncThunk(
  'booking/fetchPaymentStatus',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getPaymentStatus(bookingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch payment status'
      );
    }
  }
);

const initialState = {
  selectedSeats: [],
  currentBooking: null,
  bookings: [],
  currentPayment: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    toggleSeat: (state, action) => {
      const seat = action.payload;
      const index = state.selectedSeats.findIndex(
        (s) => s.id === seat.id
      );
      if (index >= 0) {
        state.selectedSeats.splice(index, 1);
      } else {
        state.selectedSeats.push(seat);
      }
    },
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
      state.currentPayment = null;
    },
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.data || action.payload;
        state.selectedSeats = [];
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data || action.payload || [];
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const cancelled = action.payload.data || action.payload;
        const index = state.bookings.findIndex((b) => b.id === cancelled.id);
        if (index >= 0) {
          state.bookings[index] = cancelled;
        }
        if (state.currentBooking?.id === cancelled.id) {
          state.currentBooking = cancelled;
        }
      })
      // Confirm booking
      .addCase(confirmBooking.fulfilled, (state, action) => {
        const confirmed = action.payload.data || action.payload;
        state.currentBooking = confirmed;
        const index = state.bookings.findIndex((b) => b.id === confirmed.id);
        if (index >= 0) {
          state.bookings[index] = confirmed;
        }
      })
      // Initiate payment
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload.data || action.payload;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Simulate webhook (payment completion)
      .addCase(simulateWebhook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(simulateWebhook.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload.data || action.payload;
      })
      .addCase(simulateWebhook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch payment status
      .addCase(fetchPaymentStatus.fulfilled, (state, action) => {
        state.currentPayment = action.payload.data || action.payload;
      });
  },
});

export const { toggleSeat, clearSelectedSeats, clearCurrentBooking, clearBookingError } =
  bookingSlice.actions;
export default bookingSlice.reducer;
