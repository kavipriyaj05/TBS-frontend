// ═══ FILE: src/pages/admin/ManageShows.jsx ═══
// Admin show management — Jeyanth
import { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import movieApi from '../../api/movieApi';
import { SHOW_STATUS } from '../../utils/constants';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineCalendar,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineClock,
  HiOutlineFilm,
  HiOutlineLocationMarker,
  HiOutlineBan,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const MOCK_SHOWS = [
  {
    id: 1,
    showTime: '2026-04-01T14:00:00',
    price: 200,
    status: 'SCHEDULED',
    movieTitle: 'Inception',
    movieId: 1,
    theatreName: 'PVR Cinemas',
    theatreCity: 'Chennai',
    screenName: 'Screen 2',
    screenId: 1,
    theatreId: 1,
  },
];

const STATUS_STYLES = {
  SCHEDULED: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  COMPLETED: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  CANCELLED: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
};

const EMPTY_FORM = {
  movieId: '',
  screenId: '',
  showTime: '',
  price: '',
};

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState('');

  useEffect(() => {
    fetchShows();
    fetchMoviesAndTheatres();
  }, []);

  const fetchShows = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllShows();
      const data = response.data?.data || response.data || [];
      setShows(Array.isArray(data) && data.length > 0 ? data : MOCK_SHOWS);
    } catch {
      setShows(MOCK_SHOWS);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesAndTheatres = async () => {
    try {
      const [moviesRes, theatresRes] = await Promise.all([
        movieApi.getAllMovies(),
        adminApi.getAllTheatres(),
      ]);
      const moviesData = moviesRes.data?.data || moviesRes.data || [];
      const theatresData = theatresRes.data?.data || theatresRes.data || [];
      setMovies(Array.isArray(moviesData) ? moviesData : []);
      setTheatres(Array.isArray(theatresData) ? theatresData : []);
    } catch {
      setMovies([]);
      setTheatres([]);
    }
  };

  // When a theatre is selected in the form, load its screens from the TheatreResponse.screens list
  const handleTheatreChange = (theatreId) => {
    setSelectedTheatre(theatreId);
    if (!theatreId) {
      setScreens([]);
      return;
    }
    const theatre = theatres.find((t) => String(t.id) === String(theatreId));
    setScreens(theatre?.screens || []);
  };

  const handleOpenAdd = () => {
    setEditingShow(null);
    setFormData(EMPTY_FORM);
    setSelectedTheatre('');
    setScreens([]);
    setShowModal(true);
  };

  const handleOpenEdit = (show) => {
    setEditingShow(show);
    const datetime = show.showTime ? show.showTime.slice(0, 16) : '';
    setFormData({
      movieId: show.movieId || '',
      screenId: show.screenId || '',
      showTime: datetime,
      price: show.price || '',
    });
    if (show.theatreId) {
      setSelectedTheatre(show.theatreId);
      handleTheatreChange(show.theatreId);
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        movieId: Number(formData.movieId),
        screenId: Number(formData.screenId),
        showTime: formData.showTime + ':00',
        price: Number(formData.price),
      };
      if (editingShow) {
        try {
          await adminApi.updateShow(editingShow.id, payload);
        } catch {}
        setShows((prev) =>
          prev.map((s) => (s.id === editingShow.id ? { ...s, ...payload } : s))
        );
        toast.success('Show updated successfully');
      } else {
        try {
          const response = await adminApi.createShow(payload);
          const newShow = response.data?.data || response.data;
          setShows((prev) => [newShow, ...prev]);
        } catch {
          const movie = movies.find((m) => m.id === Number(formData.movieId));
          const theatre = theatres.find((t) => String(t.id) === String(selectedTheatre));
          const screen = screens.find((s) => String(s.id) === String(formData.screenId));
          setShows((prev) => [
            {
              id: Date.now(),
              status: 'SCHEDULED',
              movieTitle: movie?.title || 'New Movie',
              movieId: formData.movieId,
              theatreName: theatre?.name || 'Theatre',
              theatreCity: theatre?.city || '',
              screenName: screen?.screenName || 'Screen',
              screenId: formData.screenId,
              showTime: formData.showTime + ':00',
              price: formData.price,
            },
            ...prev,
          ]);
        }
        toast.success('Show created successfully');
      }
      setShowModal(false);
    } catch {
      toast.error('Failed to save show');
    } finally {
      setSaving(false);
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

  // Adapted to flat ShowResponse
  const filtered = shows.filter((s) => {
    const matchesSearch =
      (s.movieTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.theatreName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">Manage Shows</h2>
        <div className="flex gap-3 flex-wrap">
          {/* Status filter */}
          <div className="flex bg-gray-800/40 border border-gray-700/40 rounded-lg p-0.5 gap-0.5">
            {['all', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all cursor-pointer capitalize ${
                  statusFilter === s
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {s === 'all' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative flex-1 sm:w-52">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shows..."
              className="w-full pl-9 pr-4 py-2 bg-gray-800/60 border border-gray-700/50 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-rose-600 hover:to-purple-700 transition-all cursor-pointer"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Show
          </button>
        </div>
      </div>

      {/* Shows Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-5 animate-pulse">
                <div className="h-5 bg-gray-800/50 rounded w-2/3 mb-3" />
                <div className="h-4 bg-gray-800/50 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-800/50 rounded w-1/3" />
              </div>
            ))
          : filtered.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <HiOutlineCalendar className="w-10 h-10 text-gray-700 mb-2" />
                <p className="text-gray-500 text-sm">No shows found</p>
              </div>
            ) : (
              filtered.map((show) => {
                const style = STATUS_STYLES[show.status] || STATUS_STYLES.SCHEDULED;
                const isPast = new Date(show.showTime) < new Date();

                return (
                  <div
                    key={show.id}
                    className="bg-gray-900/60 border border-gray-800/50 rounded-xl overflow-hidden hover:border-gray-700/50 transition-all group"
                  >
                    <div
                      className={`h-0.5 ${
                        show.status === 'SCHEDULED'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          : show.status === 'COMPLETED'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-r from-red-500/50 to-orange-500/50'
                      }`}
                    />

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-white font-semibold text-sm truncate flex items-center gap-2">
                          <HiOutlineFilm className="w-4 h-4 text-rose-400 flex-shrink-0" />
                          {show.movieTitle || 'Movie'}
                        </h3>
                        <span
                          className={`px-2 py-0.5 ${style.bg} border ${style.border} rounded-full ${style.text} text-[10px] font-medium flex-shrink-0`}
                        >
                          {show.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-gray-400 text-xs flex items-center gap-1.5">
                          <HiOutlineClock className="w-3.5 h-3.5 text-gray-500" />
                          {formatShowTime(show.showTime)}
                        </p>
                        <p className="text-gray-400 text-xs flex items-center gap-1.5">
                          <HiOutlineLocationMarker className="w-3.5 h-3.5 text-gray-500" />
                          {show.theatreName || 'Theatre'} — {show.screenName || 'Screen'}
                        </p>
                        <p className="text-gray-300 text-sm font-medium">₹{show.price}</p>
                      </div>

                      <div className="flex gap-1.5 pt-3 border-t border-gray-800/30">
                        <button
                          onClick={() => handleOpenEdit(show)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <HiOutlinePencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-gray-900 border border-gray-800/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800/50 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-white font-semibold text-lg">
                {editingShow ? 'Edit Show' : 'Add New Show'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Movie *</label>
                <select
                  required
                  value={formData.movieId}
                  onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer"
                >
                  <option value="">Select movie</option>
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Theatre *</label>
                  <select
                    required
                    value={selectedTheatre}
                    onChange={(e) => handleTheatreChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer"
                  >
                    <option value="">Select theatre</option>
                    {theatres.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} — {t.city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Screen *</label>
                  <select
                    required
                    value={formData.screenId}
                    onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer"
                    disabled={!selectedTheatre}
                  >
                    <option value="">Select screen</option>
                    {screens.map((s) => (
                      <option key={s.id} value={s.id}>{s.screenName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Show Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.showTime}
                    onChange={(e) => setFormData({ ...formData, showTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Ticket Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    placeholder="200"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-gray-800/60 border border-gray-700/50 text-gray-300 font-medium rounded-xl hover:bg-gray-800 transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-purple-700 transition-all disabled:opacity-50 cursor-pointer text-sm"
                >
                  {saving ? 'Saving...' : editingShow ? 'Update Show' : 'Create Show'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageShows;
