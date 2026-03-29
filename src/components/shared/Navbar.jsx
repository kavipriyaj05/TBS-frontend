// ═══ FILE: src/components/shared/Navbar.jsx ═══
// Top navigation bar with auth-aware rendering — Kavi
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import { HiOutlineTicket, HiOutlineSearch, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:shadow-rose-500/40 transition-shadow">
              <HiOutlineTicket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
              TicketMaster
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, events..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800/60 border border-gray-700/50 rounded-full text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
            >
              Movies
            </Link>

            {token && user ? (
              <div className="flex items-center gap-3">
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/bookings"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  My Bookings
                </Link>
                <div className="flex items-center gap-2 ml-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-gray-300 text-sm font-medium max-w-[100px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-1.5 text-sm font-medium text-rose-400 border border-rose-500/30 rounded-full hover:bg-rose-500/10 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-purple-600 rounded-full hover:from-rose-600 hover:to-purple-700 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiOutlineMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800/50 bg-gray-950/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-full text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>
            </form>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-300 hover:text-white text-sm font-medium"
            >
              Movies
            </Link>
            {token && user ? (
              <>
                <Link
                  to="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-gray-300 hover:text-white text-sm font-medium"
                >
                  My Bookings
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-gray-300 hover:text-white text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-400 text-sm font-medium cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-medium text-gray-300 border border-gray-700 rounded-full hover:bg-gray-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-purple-600 rounded-full hover:from-rose-600 hover:to-purple-700 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
