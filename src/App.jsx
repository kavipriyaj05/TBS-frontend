// ═══ FILE: src/App.jsx ═══
// Main application with routing — Kavi + Jeyanth (integrated)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MovieDetailPage from './pages/MovieDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingConfirmPage from './pages/BookingConfirmPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivateRoute from './utils/PrivateRoute';

function App() {
  return (
    <Router>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#f43f5e', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />

            {/* Protected routes — Jeyanth's module (now integrated) */}
            <Route
              path="/shows/:id/seats"
              element={
                <PrivateRoute>
                  <SeatSelectionPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <PrivateRoute>
                  <BookingHistoryPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings/:id/confirm"
              element={
                <PrivateRoute>
                  <BookingConfirmPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-7xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent mb-4">
                      404
                    </p>
                    <p className="text-gray-400 text-lg mb-6">Page not found</p>
                    <a
                      href="/"
                      className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium rounded-full hover:from-rose-600 hover:to-purple-700 transition-all"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
