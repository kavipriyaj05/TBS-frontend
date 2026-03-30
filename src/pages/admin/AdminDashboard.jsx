// ═══ FILE: src/pages/admin/AdminDashboard.jsx ═══
// Admin dashboard with sub-navigation — Jeyanth
import { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import ManageMovies from './ManageMovies';
import ManageShows from './ManageShows';
import ManageTheatres from './ManageTheatres';
import {
  HiOutlineChartBar,
  HiOutlineFilm,
  HiOutlineCalendar,
  HiOutlineOfficeBuilding,
  HiOutlineTicket,
  HiOutlineUsers,
  HiOutlineCash,
  HiOutlineTrendingUp,
} from 'react-icons/hi';

const STAT_CARDS = [
  { key: 'totalMovies', label: 'Movies', icon: HiOutlineFilm, color: 'rose', format: (v) => v },
  { key: 'totalTheatres', label: 'Theatres', icon: HiOutlineOfficeBuilding, color: 'purple', format: (v) => v },
  { key: 'totalBookings', label: 'Bookings', icon: HiOutlineTicket, color: 'blue', format: (v) => v },
  { key: 'totalShows', label: 'Shows', icon: HiOutlineCalendar, color: 'emerald', format: (v) => v },
  { key: 'totalUsers', label: 'Users', icon: HiOutlineChartBar, color: 'amber', format: (v) => v },
  { key: 'totalRevenue', label: 'Revenue', icon: HiOutlineChartBar, color: 'teal', format: (v) => v > 0 ? `₹${(v / 1000).toFixed(1)}K` : '₹0' },
];

const COLOR_MAP = {
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', icon: 'text-rose-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', icon: 'text-purple-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: 'text-emerald-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: 'text-amber-400' },
  teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400', icon: 'text-teal-400' },
};

const NAV_ITEMS = [
  { path: '/admin', label: 'Overview', icon: HiOutlineChartBar, exact: true },
  { path: '/admin/movies', label: 'Movies', icon: HiOutlineFilm },
  { path: '/admin/shows', label: 'Shows', icon: HiOutlineCalendar },
  { path: '/admin/theatres', label: 'Theatres', icon: HiOutlineOfficeBuilding },
];

// ── Overview sub-component — fetches stats from real endpoints ──
const AdminOverview = () => {
  const [stats, setStats] = useState({ totalMovies: 0, totalTheatres: 0, totalBookings: 0, totalShows: 0, totalUsers: 0, totalRevenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getDashboardStats();
        const data = response.data?.data || response.data || {};
        setStats({
          totalMovies: data.totalMovies || 0,
          totalTheatres: data.totalTheatres || 0,
          totalShows: data.totalShows || 0,
          totalBookings: data.totalBookings || 0,
          totalUsers: data.totalUsers || 0,
          totalRevenue: data.totalRevenue || 0,
        });
      } catch {
        // Keep zeros
      }
    };
    fetchStats();
  }, []);


  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Dashboard Overview</h2>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, format }) => {
          const c = COLOR_MAP[color];
          return (
            <div
              key={key}
              className={`${c.bg} border ${c.border} rounded-xl p-4 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${c.icon}`} />
                <span className="text-gray-400 text-xs">{label}</span>
              </div>
              <p className={`text-2xl font-bold ${c.text}`}>{format(stats[key] || 0)}</p>
            </div>
          );
        })}
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-white font-semibold text-sm mb-4">System Status</h3>
        <div className="space-y-3">
          {[
            { text: 'All backend services are operational', type: 'ok' },
            { text: `${stats.totalMovies} movies currently active`, type: 'movie' },
            { text: `${stats.totalShows} shows scheduled`, type: 'show' },
            { text: `${stats.totalBookings} total bookings processed`, type: 'booking' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 px-3 bg-gray-800/30 rounded-lg"
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  item.type === 'ok'
                    ? 'bg-emerald-400'
                    : item.type === 'movie'
                    ? 'bg-rose-400'
                    : item.type === 'show'
                    ? 'bg-blue-400'
                    : 'bg-purple-400'
                }`}
              />
              <span className="text-gray-300 text-sm flex-1">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Admin Header */}
      <div className="bg-gray-900/60 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </span>
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage movies, shows, and theatres</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                System Online
              </span>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex gap-1 mt-5 overflow-x-auto pb-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon, exact }) => {
              const isActive = exact
                ? location.pathname === path
                : location.pathname.startsWith(path);

              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="movies" element={<ManageMovies />} />
          <Route path="shows" element={<ManageShows />} />
          <Route path="theatres" element={<ManageTheatres />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
