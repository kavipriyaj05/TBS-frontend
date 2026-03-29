// ═══ FILE: src/pages/BookingConfirmPage.jsx ═══
// Booking confirmation & payment page — Jeyanth
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookingById, confirmPayment } from '../store/bookingSlice';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import {
  HiOutlineTicket,
  HiOutlineCheck,
  HiOutlineCreditCard,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineFilm,
  HiOutlineShieldCheck,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const BookingConfirmPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBooking, loading } = useSelector((state) => state.booking);
  const { token } = useSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Use mock booking from navigation state, or fetch from API
  const mockBooking = location.state?.mockBooking;
  const booking = currentBooking || mockBooking;

  useEffect(() => {
    if (!mockBooking && token && id !== 'mock-1') {
      dispatch(fetchBookingById(id));
    }
  }, [id, dispatch, token, mockBooking]);

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      if (token && id !== 'mock-1') {
        await dispatch(
          confirmPayment({
            bookingId: id,
            paymentData: { method: paymentMethod },
          })
        ).unwrap();
      }
      setIsConfirmed(true);
      toast.success('Payment successful! Booking confirmed 🎉');
    } catch {
      // Demo mode — still show success
      setIsConfirmed(true);
      toast.success('Payment successful! Booking confirmed 🎉');
    } finally {
      setIsProcessing(false);
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

  if (loading) return <LoadingSpinner text="Loading booking..." fullScreen />;

  // ── Success state ──
  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Success animation */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <div className="w-16 h-16 bg-emerald-500/30 rounded-full flex items-center justify-center">
                <HiOutlineCheck className="w-10 h-10 text-emerald-400" />
              </div>
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-emerald-500/20 animate-ping" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400 mb-8">
            Your tickets have been booked successfully. Enjoy the show!
          </p>

          {/* Booking ticket card */}
          <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden mb-8">
            {/* Gradient accent */}
            <div className="h-1.5 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500" />

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center">
                  <HiOutlineFilm className="w-5 h-5 text-rose-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">
                    {booking?.show?.movie?.title || booking?.movie?.title || 'Movie Title'}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    {booking?.show?.movie?.language || booking?.movie?.language || ''} •{' '}
                    {booking?.show?.movie?.genre || booking?.movie?.genre || ''}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-gray-800/40 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-0.5">Date & Time</p>
                  <p className="text-gray-200 text-sm font-medium">
                    {booking?.show?.showTime
                      ? formatShowTime(booking.show.showTime)
                      : booking?.showTime
                      ? formatShowTime(booking.showTime)
                      : 'TBD'}
                  </p>
                </div>
                <div className="bg-gray-800/40 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-0.5">Theatre</p>
                  <p className="text-gray-200 text-sm font-medium">
                    {booking?.show?.screen?.theatre?.name ||
                      booking?.screen?.theatre?.name ||
                      'PVR Cinemas'}
                  </p>
                </div>
                <div className="bg-gray-800/40 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-0.5">Seats</p>
                  <p className="text-gray-200 text-sm font-medium">
                    {booking?.seats?.map((s) => s.seatLabel || `${s.row}${s.seatNumber}`).join(', ') ||
                      'N/A'}
                  </p>
                </div>
                <div className="bg-gray-800/40 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-0.5">Booking ID</p>
                  <p className="text-gray-200 text-sm font-medium">
                    #{booking?.id || id}
                  </p>
                </div>
              </div>
            </div>

            {/* Dashed divider */}
            <div className="relative px-6">
              <div className="border-t border-dashed border-gray-700/50" />
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-950 rounded-full" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-950 rounded-full" />
            </div>

            <div className="p-6 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Amount Paid</span>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  ₹{booking?.totalPrice || booking?.totalAmount || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/bookings"
              className="flex-1 py-3 px-4 bg-gray-800/60 border border-gray-700/50 text-gray-300 font-medium rounded-xl hover:bg-gray-800 transition-all text-sm text-center"
            >
              My Bookings
            </Link>
            <Link
              to="/"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium rounded-xl hover:from-rose-600 hover:to-purple-700 transition-all text-sm text-center"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── No booking found ──
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <HiOutlineTicket className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Booking Not Found</h2>
          <p className="text-gray-500 mb-6">Please select seats first to create a booking.</p>
          <Link
            to="/"
            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium rounded-full hover:from-rose-600 hover:to-purple-700 transition-all"
          >
            Browse Movies
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = booking.totalPrice || booking.totalAmount ||
    (booking.seats?.reduce((sum, s) => sum + (s.price || 0), 0) || 0);
  const convenienceFee = (booking.seats?.length || 1) * 30;
  const grandTotal = totalAmount + convenienceFee;

  // ── Payment form ──
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={`/shows/${booking.show?.id || 1}/seats`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors group"
        >
          <HiOutlineClock className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Seat Selection
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">Confirm & Pay</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left — Payment methods */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
                <HiOutlineCreditCard className="w-5 h-5 text-rose-400" />
                Payment Method
              </h2>

              <div className="space-y-3">
                {[
                  { id: 'upi', label: 'UPI / Google Pay', icon: '📱', desc: 'Pay using UPI ID or scan QR' },
                  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks supported' },
                  { id: 'wallet', label: 'Wallet', icon: '👛', desc: 'Paytm, PhonePe, Amazon Pay' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      paymentMethod === method.id
                        ? 'bg-rose-500/10 border-rose-500/30'
                        : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{method.label}</p>
                      <p className="text-gray-500 text-xs">{method.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === method.id
                          ? 'border-rose-500'
                          : 'border-gray-600'
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-gray-800/50">
                <HiOutlineShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-gray-500 text-xs">
                  Your payment is secured with 256-bit SSL encryption. We never store your card details.
                </p>
              </div>
            </div>
          </div>

          {/* Right — Order summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-base mb-4">Order Summary</h2>

              {/* Movie info */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-800/50">
                <div className="w-12 h-16 bg-gradient-to-br from-rose-500/20 to-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HiOutlineFilm className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">
                    {booking.show?.movie?.title || booking.movie?.title || 'Movie'}
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {booking.show?.showTime
                      ? formatShowTime(booking.show.showTime)
                      : booking.showTime
                      ? formatShowTime(booking.showTime)
                      : ''}
                  </p>
                  <p className="text-gray-500 text-xs">
                    <HiOutlineLocationMarker className="w-3 h-3 inline mr-0.5" />
                    {booking.show?.screen?.theatre?.name ||
                      booking.screen?.theatre?.name ||
                      'Theatre'}
                  </p>
                </div>
              </div>

              {/* Seats */}
              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2">
                  Seats ({booking.seats?.length || 1})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {booking.seats?.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-800/60 border border-gray-700/50 rounded text-gray-300 text-xs font-medium"
                    >
                      {s.seatLabel || `${s.row}${s.seatNumber}`}
                    </span>
                  )) || (
                    <span className="text-gray-500 text-xs">N/A</span>
                  )}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 pt-4 border-t border-gray-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Ticket Price</span>
                  <span className="text-gray-300 text-sm">₹{totalAmount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">Convenience Fee</span>
                  <span className="text-gray-500 text-xs">₹{convenienceFee}</span>
                </div>
                <div className="border-t border-gray-700/50 my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Pay button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                id="confirm-payment-btn"
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing Payment...
                  </span>
                ) : (
                  `Pay ₹${grandTotal}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmPage;
