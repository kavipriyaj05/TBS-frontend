// ═══ FILE: src/pages/BookingHistoryPage.jsx ═══
// User's booking history — connected to backend
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyBookings, cancelBooking } from '../store/bookingSlice';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import {
  HiOutlineTicket,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineFilm,
  HiOutlineCalendar,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineExclamation,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  CONFIRMED: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    icon: HiOutlineCheck,
  },
  PENDING: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
    icon: HiOutlineClock,
  },
  CANCELLED: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    icon: HiOutlineX,
  },
};

const BookingHistoryPage = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.booking);
  const { token } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchMyBookings());
    }
  }, [dispatch, token]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(bookingId);
    try {
      await dispatch(cancelBooking(bookingId)).unwrap();
      toast.success('Booking cancelled. Refund will be processed.');
    } catch (err) {
      toast.error(err || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings =
    filter === 'all' ? bookings : bookings.filter((b) => b.status === filter.toUpperCase());

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const formatShowTime = (datetime) =>
    new Date(datetime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const isUpcoming = (showTime) => new Date(showTime) > new Date();

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">My Bookings</h1>
            <p className="text-gray-500 text-sm mt-1">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex bg-gray-900/60 border border-gray-800/50 rounded-xl p-1">
            {['all', 'confirmed', 'pending', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-xs font-medium rounded-lg capitalize transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && bookings.length === 0 ? (
          <LoadingSpinner text="Loading bookings..." />
        ) : filteredBookings.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gray-800/50 rounded-2xl flex items-center justify-center mb-4">
              <HiOutlineTicket className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-gray-400 text-lg font-semibold mb-1">No Bookings Found</h3>
            <p className="text-gray-600 text-sm text-center max-w-sm mb-6">
              {filter === 'all'
                ? "You haven't booked any tickets yet. Start exploring movies!"
                : `No ${filter} bookings found.`}
            </p>
            <Link
              to="/"
              className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium rounded-full hover:from-rose-600 hover:to-purple-700 transition-all text-sm"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          /* Bookings list */
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const statusStyle = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING;
              const StatusIcon = statusStyle.icon;
              const upcoming = isUpcoming(booking.showTime);

              return (
                <div
                  key={booking.id}
                  id={`booking-${booking.id}`}
                  className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700/50 transition-all group"
                >
                  {/* Top accent bar */}
                  <div
                    className={`h-0.5 ${
                      booking.status === 'CONFIRMED'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : booking.status === 'CANCELLED'
                        ? 'bg-gradient-to-r from-red-500/50 to-red-600/50'
                        : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                    }`}
                  />

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Movie poster placeholder */}
                      <div className="w-16 h-20 sm:w-20 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, hsl(${
                              (booking.id * 47) % 360
                            }, 70%, 25%), hsl(${
                              (booking.id * 47 + 60) % 360
                            }, 70%, 15%))`,
                          }}
                        >
                          <span className="text-2xl font-bold text-white/20">
                            {booking.movieTitle?.charAt(0) || 'M'}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="text-white font-semibold text-base sm:text-lg truncate">
                              {booking.movieTitle || 'Movie'}
                            </h3>
                          </div>

                          {/* Status badge */}
                          <span
                            className={`flex items-center gap-1 px-2.5 py-1 ${statusStyle.bg} border ${statusStyle.border} rounded-full ${statusStyle.text} text-xs font-medium flex-shrink-0`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {booking.status}
                          </span>
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3">
                          <div>
                            <p className="text-gray-600 text-[10px] uppercase tracking-wider">Show Time</p>
                            <p className="text-gray-300 text-xs font-medium mt-0.5 flex items-center gap-1">
                              <HiOutlineClock className="w-3 h-3 text-gray-500" />
                              {booking.showTime
                                ? formatShowTime(booking.showTime)
                                : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-[10px] uppercase tracking-wider">Theatre</p>
                            <p className="text-gray-300 text-xs font-medium mt-0.5 flex items-center gap-1">
                              <HiOutlineLocationMarker className="w-3 h-3 text-gray-500" />
                              {booking.theatreName || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-[10px] uppercase tracking-wider">Seats</p>
                            <p className="text-gray-300 text-xs font-medium mt-0.5">
                              {booking.seats?.map((s) => s.seatNumber).join(', ') || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-[10px] uppercase tracking-wider">Amount</p>
                            <p className="text-white text-sm font-semibold mt-0.5">
                              ₹{booking.totalAmount || 0}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-800/30">
                          <span className="text-gray-600 text-[10px]">
                            <HiOutlineCalendar className="w-3 h-3 inline mr-1" />
                            Booked {booking.bookedAt ? formatDate(booking.bookedAt) : ''}
                          </span>
                          <span className="text-gray-700">•</span>
                          <span className="text-gray-600 text-[10px]">
                            ID: #{booking.id}
                          </span>

                          <div className="ml-auto flex gap-2">
                            {booking.status === 'PENDING' && (
                              <Link
                                to={`/bookings/${booking.id}/confirm`}
                                className="px-3 py-1.5 text-xs text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/10 transition-colors"
                              >
                                Pay Now
                              </Link>
                            )}
                            {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && upcoming && (
                              <button
                                onClick={() => handleCancel(booking.id)}
                                disabled={cancellingId === booking.id}
                                className="px-3 py-1.5 text-xs text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            )}
                            {booking.status === 'CANCELLED' && (
                              <span className="px-3 py-1.5 text-xs text-gray-500 bg-gray-800/30 rounded-lg flex items-center gap-1">
                                <HiOutlineExclamation className="w-3 h-3" />
                                Cancelled
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
