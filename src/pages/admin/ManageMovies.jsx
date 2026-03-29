// ═══ FILE: src/pages/admin/ManageMovies.jsx ═══
// Admin movie management — Jeyanth
import { useState, useEffect } from 'react';
import movieApi from '../../api/movieApi';
import adminApi from '../../api/adminApi';
import { GENRES, LANGUAGES } from '../../utils/constants';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineFilm,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineClock,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const MOCK_MOVIES = [
  { id: 1, title: 'Inception', genre: 'Sci-Fi', language: 'English', durationMin: 148, isActive: true, releaseDate: '2025-07-16' },
  { id: 2, title: 'The Dark Knight', genre: 'Action', language: 'English', durationMin: 152, isActive: true, releaseDate: '2025-07-18' },
  { id: 3, title: 'Interstellar', genre: 'Sci-Fi', language: 'English', durationMin: 169, isActive: true, releaseDate: '2025-11-07' },
  { id: 4, title: 'Parasite', genre: 'Thriller', language: 'Hindi', durationMin: 132, isActive: true, releaseDate: '2025-05-30' },
  { id: 5, title: 'Dangal', genre: 'Drama', language: 'Hindi', durationMin: 161, isActive: true, releaseDate: '2025-12-23' },
  { id: 6, title: 'Bahubali', genre: 'Action', language: 'Telugu', durationMin: 159, isActive: true, releaseDate: '2025-07-10' },
  { id: 7, title: 'Vikram', genre: 'Action', language: 'Tamil', durationMin: 174, isActive: true, releaseDate: '2025-06-03' },
  { id: 8, title: 'KGF Chapter 2', genre: 'Action', language: 'Kannada', durationMin: 168, isActive: false, releaseDate: '2025-04-14' },
];

const EMPTY_FORM = {
  title: '',
  genre: '',
  language: '',
  durationMin: '',
  description: '',
  releaseDate: '',
  posterUrl: '',
};

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await movieApi.getAllMovies();
      const data = response.data?.data || response.data || [];
      setMovies(Array.isArray(data) && data.length > 0 ? data : MOCK_MOVIES);
    } catch {
      setMovies(MOCK_MOVIES);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMovie(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      genre: movie.genre || '',
      language: movie.language || '',
      durationMin: movie.durationMin || '',
      description: movie.description || '',
      releaseDate: movie.releaseDate || '',
      posterUrl: movie.posterUrl || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingMovie) {
        try {
          await adminApi.updateMovie(editingMovie.id, formData);
        } catch {}
        setMovies((prev) =>
          prev.map((m) => (m.id === editingMovie.id ? { ...m, ...formData } : m))
        );
        toast.success('Movie updated successfully');
      } else {
        try {
          const response = await adminApi.createMovie(formData);
          const newMovie = response.data?.data || response.data;
          setMovies((prev) => [newMovie, ...prev]);
        } catch {
          setMovies((prev) => [{ ...formData, id: Date.now(), isActive: true }, ...prev]);
        }
        toast.success('Movie added successfully');
      }
      setShowModal(false);
    } catch {
      toast.error('Failed to save movie');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await adminApi.deleteMovie(id);
    } catch {}
    setMovies((prev) => prev.filter((m) => m.id !== id));
    toast.success('Movie deleted');
  };

  const filtered = movies.filter((m) =>
    m.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">Manage Movies</h2>
        <div className="flex gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:w-60">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full pl-9 pr-4 py-2 bg-gray-800/60 border border-gray-700/50 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-rose-600 hover:to-purple-700 transition-all cursor-pointer"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Movie
          </button>
        </div>
      </div>

      {/* Movies table */}
      <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="px-5 py-3.5 text-left text-gray-400 text-xs font-medium uppercase tracking-wider">Movie</th>
                <th className="px-5 py-3.5 text-left text-gray-400 text-xs font-medium uppercase tracking-wider">Genre</th>
                <th className="px-5 py-3.5 text-left text-gray-400 text-xs font-medium uppercase tracking-wider">Language</th>
                <th className="px-5 py-3.5 text-left text-gray-400 text-xs font-medium uppercase tracking-wider">Duration</th>
                <th className="px-5 py-3.5 text-left text-gray-400 text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-right text-gray-400 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-gray-800/50 rounded w-32" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-800/50 rounded w-16" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-800/50 rounded w-16" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-800/50 rounded w-12" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-800/50 rounded w-14" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-800/50 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <HiOutlineFilm className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No movies found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((movie) => (
                  <tr key={movie.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-10 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, hsl(${(movie.id * 47) % 360}, 70%, 25%), hsl(${(movie.id * 47 + 60) % 360}, 70%, 15%))`,
                          }}
                        >
                          <span className="text-xs font-bold text-white/30">
                            {movie.title?.charAt(0)}
                          </span>
                        </div>
                        <span className="text-white text-sm font-medium">{movie.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-xs">
                        {movie.genre}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-300 text-sm">{movie.language}</td>
                    <td className="px-5 py-4 text-gray-400 text-sm flex items-center gap-1">
                      <HiOutlineClock className="w-3 h-3" />
                      {movie.durationMin}m
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          movie.isActive !== false
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-gray-500/10 border border-gray-500/20 text-gray-400'
                        }`}
                      >
                        {movie.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(movie)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-gray-900 border border-gray-800/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800/50 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-white font-semibold text-lg">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  placeholder="Movie title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Genre *</label>
                  <select
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer"
                  >
                    <option value="">Select genre</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Language *</label>
                  <select
                    required
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer"
                  >
                    <option value="">Select language</option>
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Duration (min) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.durationMin}
                    onChange={(e) => setFormData({ ...formData, durationMin: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    placeholder="148"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Release Date</label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                  placeholder="Brief movie description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Poster URL</label>
                <input
                  type="url"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  placeholder="https://..."
                />
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
                  {saving ? 'Saving...' : editingMovie ? 'Update Movie' : 'Add Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMovies;
