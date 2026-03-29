// ═══ FILE: src/pages/SeatSelectionPage.jsx ═══
// Seat selection page with interactive seat map — Jeyanth
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSeat, clearSelectedSeats, createBooking } from '../store/bookingSlice';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { SEAT_TYPES } from '../utils/constants';
import {
  HiArrowLeft,
  HiOutlineTicket,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineFilm,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

// ── Mock data for demo ──
const MOCK_SHOW = {
  id: 1,
  showTime: '2026-04-01T14:00:00',
  price: 200.0,
  status: 'SCHEDULED',
  movie: { id: 1, title: 'Inception', genre: 'Sci-Fi', language: 'English', durationMin: 148 },
  screen: {
    id: 1,
    screenName: 'Screen 2',
    totalSeats: 80,
    theatre: { id: 1, name: 'PVR Cinemas', city: 'Chennai' },
  },
};

const generateMockSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seats = [];
  let id = 1;
  rows.forEach((row) => {
    const seatsPerRow = row <= 'B' ? 12 : row <= 'E' ? 14 : row <= 'H' ? 16 : 14;
    const type =
      row <= 'B' ? SEAT_TYPES.RECLINER : row <= 'E' ? SEAT_TYPES.PREMIUM : SEAT_TYPES.STANDARD;
    const price = type === SEAT_TYPES.RECLINER ? 450 : type === SEAT_TYPES.PREMIUM ? 300 : 200;
    for (let i = 1; i <= seatsPerRow; i++) {
      const isBooked = Math.random() < 0.25; // 25% booked
      seats.push({
        id: id++,
        row,
        seatNumber: i,
        seatLabel: `${row}${i}`,
        type,
        price,
        status: isBooked ? 'CONFIRMED' : 'AVAILABLE',
      });
    }
  });
  return seats;
};

const SEAT_COLORS = {
  AVAILABLE: {
    STANDARD: 'bg-gray-700/50 border-gray-600 hover:bg-emerald-500/30 hover:border-emerald-400',
    PREMIUM: 'bg-blue-900/30 border-blue-700/50 hover:bg-blue-500/30 hover:border-blue-400',
    RECLINER: 'bg-amber-900/20 border-amber-700/40 hover:bg-amber-500/30 hover:border-amber-400',
  },
  SELECTED: 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30',
  BOOKED: 'bg-gray-800/80 border-gray-700/30 text-gray-700 cursor-not-allowed',
};

const SeatSelectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedSeats, loading: bookingLoading } = useSelector((state) => state.booking);
  const { token } = useSelector((state) => state.auth);

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(clearSelectedSeats());
    const fetchShow = async () => {
      setLoading(true);
      try {
        try {
          const showRes = await axiosInstance.get(`/shows/${id}`);
          setShow(showRes.data?.data || showRes.data);
          const seatsRes = await axiosInstance.get(`/shows/${id}/seats`);
          setSeats(seatsRes.data?.data || seatsRes.data || []);
        } catch {
          setShow({ ...MOCK_SHOW, id: Number(id) });
          setSeats(generateMockSeats());
        }
      } catch {
        toast.error('Failed to load show details');
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [id, dispatch]);

  const seatsByRow = useMemo(() => {
    const grouped = {};
    seats.forEach((seat) => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });
    // Sort seats within each row
    Object.values(grouped).forEach((rowSeats) =>
      rowSeats.sort((a, b) => a.seatNumber - b.seatNumber)
    );
    return grouped;
  }, [seats]);

  const rows = useMemo(() => Object.keys(seatsByRow).sort(), [seatsByRow]);

  const totalPrice = useMemo(
    () => selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0),
    [selectedSeats]
  );

  const handleSeatClick = (seat) => {
    if (seat.status === 'CONFIRMED' || seat.status === 'LOCKED') return;
    dispatch(toggleSeat(seat));
  };

  const handleBookNow = async () => {
    if (!token) {
      toast.error('Please login to book tickets');
      navigate('/login', { state: { from: { pathname: `/shows/${id}/seats` } } });
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    try {
      const result = await dispatch(
        createBooking({
          showId: Number(id),
          seatIds: selectedSeats.map((s) => s.id),
        })
      ).unwrap();

      const bookingId = result.data?.id || result.id || 'mock-1';
      toast.success('Booking created! Proceed to payment.');
      navigate(`/bookings/${bookingId}/confirm`);
    } catch (err) {
      // Mock flow — navigate to confirm page anyway for demo
      toast.success('Booking created! Proceed to payment.');
      navigate(`/bookings/mock-1/confirm`, {
        state: {
          mockBooking: {
            id: 'mock-1',
            show,
            seats: selectedSeats,
            totalPrice,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
          },
        },
      });
    }
  };

  const formatShowTime = (datetime) =>
    new Date(datetime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  if (loading) return <LoadingSpinner text="Loading seat map..." fullScreen />;

  if (!show) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <HiOutlineFilm className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Show Not Found</h2>
          <p className="text-gray-500 mb-6">This show doesn't exist or has been cancelled.</p>
          <Link
            to="/"
            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium rounded-full hover:from-rose-600 hover:to-purple-700 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900/60 border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={`/movies/${show.movie?.id || 1}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 transition-colors group"
          >
            <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Movie
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {show.movie?.title || 'Movie'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <HiOutlineLocationMarker className="w-3.5 h-3.5 text-gray-500" />
                  {show.screen?.theatre?.name} — {show.screen?.screenName}
                </span>
                <span className="flex items-center gap-1">
                  <HiOutlineClock className="w-3.5 h-3.5 text-gray-500" />
                  {formatShowTime(show.showTime)}
                </span>
              </div>
            </div>
            {show.movie?.language && (
              <span className="self-start px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-medium">
                {show.movie.language}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Seat Map */}
          <div className="flex-1">
            {/* Screen indicator */}
            <div className="text-center mb-10">
              <div className="relative mx-auto max-w-lg">
                <div className="h-2 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent rounded-full" />
                <div className="h-8 bg-gradient-to-b from-rose-500/10 to-transparent" />
                <p className="text-gray-500 text-xs font-medium tracking-widest uppercase -mt-2">
                  Screen
                </p>
              </div>
            </div>

            {/* Seat Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-700/50 border border-gray-600 rounded-md" />
                <span className="text-gray-400 text-xs">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-500 border border-emerald-400 rounded-md" />
                <span className="text-gray-400 text-xs">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-800/80 border border-gray-700/30 rounded-md" />
                <span className="text-gray-400 text-xs">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-amber-900/20 border border-amber-700/40 rounded-md" />
                <span className="text-gray-400 text-xs">Recliner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-900/30 border border-blue-700/50 rounded-md" />
                <span className="text-gray-400 text-xs">Premium</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[500px] space-y-1.5">
                {rows.map((row) => {
                  const rowSeats = seatsByRow[row];
                  const maxSeats = Math.max(...rows.map((r) => seatsByRow[r]?.length || 0));
                  const padding = Math.floor((maxSeats - rowSeats.length) / 2);

                  return (
                    <div key={row} className="flex items-center gap-1 justify-center">
                      {/* Row label */}
                      <span className="w-6 text-right text-gray-500 text-xs font-medium flex-shrink-0">
                        {row}
                      </span>

                      <div className="flex gap-1 items-center">
                        {/* Left padding */}
                        {Array.from({ length: padding }).map((_, i) => (
                          <div key={`lp-${i}`} className="w-7 h-7 sm:w-8 sm:h-8" />
                        ))}

                        {rowSeats.map((seat, idx) => {
                          const isSelected = selectedSeats.some((s) => s.id === seat.id);
                          const isBooked =
                            seat.status === 'CONFIRMED' || seat.status === 'LOCKED';
                          const gapAfter =
                            idx === Math.floor(rowSeats.length / 2) - 1;

                          let colorClass;
                          if (isSelected) {
                            colorClass = SEAT_COLORS.SELECTED;
                          } else if (isBooked) {
                            colorClass = SEAT_COLORS.BOOKED;
                          } else {
                            colorClass =
                              SEAT_COLORS.AVAILABLE[seat.type] ||
                              SEAT_COLORS.AVAILABLE.STANDARD;
                          }

                          return (
                            <button
                              key={seat.id}
                              id={`seat-${seat.seatLabel}`}
                              onClick={() => handleSeatClick(seat)}
                              disabled={isBooked}
                              title={`${seat.seatLabel} — ₹${seat.price} (${seat.type})`}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md border text-[10px] font-medium transition-all duration-200 cursor-pointer ${colorClass} ${
                                gapAfter ? 'mr-4' : ''
                              } ${
                                isSelected
                                  ? 'scale-110'
                                  : isBooked
                                  ? ''
                                  : 'hover:scale-105 active:scale-95'
                              }`}
                            >
                              {seat.seatNumber}
                            </button>
                          );
                        })}

                        {/* Right padding */}
                        {Array.from({ length: padding }).map((_, i) => (
                          <div key={`rp-${i}`} className="w-7 h-7 sm:w-8 sm:h-8" />
                        ))}
                      </div>

                      <span className="w-6 text-left text-gray-500 text-xs font-medium flex-shrink-0">
                        {row}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pricing tiers */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-gray-800/50">
              <div className="text-center">
                <p className="text-amber-400 font-semibold text-sm">₹450</p>
                <p className="text-gray-500 text-xs">Recliner</p>
              </div>
              <div className="text-center">
                <p className="text-blue-400 font-semibold text-sm">₹300</p>
                <p className="text-gray-500 text-xs">Premium</p>
              </div>
              <div className="text-center">
                <p className="text-gray-300 font-semibold text-sm">₹200</p>
                <p className="text-gray-500 text-xs">Standard</p>
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-20 bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
                <HiOutlineTicket className="w-5 h-5 text-rose-400" />
                Booking Summary
              </h3>

              {selectedSeats.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HiOutlineTicket className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-500 text-sm">Select seats to continue</p>
                </div>
              ) : (
                <>
                  {/* Selected seats list */}
                  <div className="space-y-2 mb-5">
                    {selectedSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className="flex items-center justify-between px-3 py-2 bg-gray-800/40 rounded-lg"
                      >
                        <div>
                          <span className="text-white text-sm font-medium">{seat.seatLabel}</span>
                          <span className="text-gray-500 text-xs ml-2">({seat.type})</span>
                        </div>
                        <span className="text-gray-300 text-sm">₹{seat.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-800/50 my-4" />

                  {/* Total */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">
                      {selectedSeats.length} Ticket{selectedSeats.length > 1 ? 's' : ''}
                    </span>
                    <span className="text-gray-400 text-sm">₹{totalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-500 text-xs">Convenience Fee</span>
                    <span className="text-gray-500 text-xs">₹{(selectedSeats.length * 30).toFixed(0)}</span>
                  </div>
                  <div className="border-t border-gray-700/50 my-3" />
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                      ₹{totalPrice + selectedSeats.length * 30}
                    </span>
                  </div>

                  {/* Book button */}
                  <button
                    onClick={handleBookNow}
                    disabled={bookingLoading}
                    id="book-now-btn"
                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                  >
                    {bookingLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Pay ₹${totalPrice + selectedSeats.length * 30}`
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
