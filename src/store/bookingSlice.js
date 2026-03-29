// ═══ FILE: src/store/bookingSlice.js ═══
// Redux booking slice — Jeyanth
// Manages booking state: selectedSeats, currentBooking, bookings list
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingApi from '../api/bookingApi';

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

export const fetchBookingById = createAsyncThunk(
  'booking/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getBookingById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch booking'
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

export const confirmPayment = createAsyncThunk(
  'booking/confirmPayment',
  async ({ bookingId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.confirmPayment(bookingId, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Payment failed'
      );
    }
  }
);

const initialState = {
  selectedSeats: [],
  currentBooking: null,
  bookings: [],
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
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.data || action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
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
      // Confirm payment
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.data || action.payload;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleSeat, clearSelectedSeats, clearCurrentBooking, clearBookingError } =
  bookingSlice.actions;
export default bookingSlice.reducer;
