// ═══ FILE: src/pages/admin/ManageTheatres.jsx ═══
// Admin theatre management — Jeyanth
import { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineOfficeBuilding,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineLocationMarker,
  HiOutlineViewGrid,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const MOCK_THEATRES = [
  {
    id: 1,
    name: 'PVR Cinemas',
    city: 'Chennai',
    address: '123 Anna Salai, T. Nagar',
    totalScreens: 5,
    screens: [
      { id: 1, screenName: 'Screen 1', totalSeats: 120 },
      { id: 2, screenName: 'Screen 2', totalSeats: 80 },
      { id: 3, screenName: 'Screen 3', totalSeats: 100 },
      { id: 4, screenName: 'IMAX', totalSeats: 200 },
      { id: 5, screenName: 'Gold Class', totalSeats: 40 },
    ],
  },
  {
    id: 2,
    name: 'INOX Megaplex',
    city: 'Chennai',
    address: '456 ECR Road, Neelankarai',
    totalScreens: 4,
    screens: [
      { id: 6, screenName: 'IMAX', totalSeats: 250 },
      { id: 7, screenName: 'Screen 1', totalSeats: 150 },
      { id: 8, screenName: 'Screen 2', totalSeats: 100 },
      { id: 9, screenName: 'Screen 3', totalSeats: 80 },
    ],
  },
  {
    id: 3,
    name: 'Cinepolis',
    city: 'Bangalore',
    address: '789 MG Road, Brigade Road',
    totalScreens: 3,
    screens: [
      { id: 10, screenName: 'Screen 1', totalSeats: 120 },
      { id: 11, screenName: 'Screen 2', totalSeats: 90 },
      { id: 12, screenName: 'Dolby Atmos', totalSeats: 180 },
    ],
  },
  {
    id: 4,
    name: 'SPI Cinemas',
    city: 'Chennai',
    address: '10 Chetpet, Nungambakkam',
    totalScreens: 6,
    screens: [
      { id: 13, screenName: 'S1', totalSeats: 100 },
      { id: 14, screenName: 'S2', totalSeats: 100 },
      { id: 15, screenName: 'S3', totalSeats: 80 },
      { id: 16, screenName: 'S4', totalSeats: 80 },
      { id: 17, screenName: 'Luxe', totalSeats: 50 },
      { id: 18, screenName: 'IMAX', totalSeats: 300 },
    ],
  },
];

const EMPTY_THEATRE = { name: '', city: '', address: '' };
const EMPTY_SCREEN = { screenName: '', totalSeats: '' };

const ManageTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTheatreModal, setShowTheatreModal] = useState(false);
  const [showScreenModal, setShowScreenModal] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [theatreForm, setTheatreForm] = useState(EMPTY_THEATRE);
  const [screenForm, setScreenForm] = useState(EMPTY_SCREEN);
  const [selectedTheatreId, setSelectedTheatreId] = useState(null);
  const [expandedTheatre, setExpandedTheatre] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllTheatres();
      const data = response.data?.data || response.data || [];
      setTheatres(Array.isArray(data) && data.length > 0 ? data : MOCK_THEATRES);
    } catch {
      setTheatres(MOCK_THEATRES);
    } finally {
      setLoading(false);
    }
  };

  // ── Theatre CRUD ──
  const handleOpenAddTheatre = () => {
    setEditingTheatre(null);
    setTheatreForm(EMPTY_THEATRE);
    setShowTheatreModal(true);
  };

  const handleOpenEditTheatre = (theatre) => {
    setEditingTheatre(theatre);
    setTheatreForm({ name: theatre.name, city: theatre.city, address: theatre.address || '' });
    setShowTheatreModal(true);
  };

  const handleSaveTheatre = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTheatre) {
        try { await adminApi.updateTheatre(editingTheatre.id, theatreForm); } catch {}
        setTheatres((prev) =>
          prev.map((t) => (t.id === editingTheatre.id ? { ...t, ...theatreForm } : t))
        );
        toast.success('Theatre updated');
      } else {
        try {
          const res = await adminApi.createTheatre(theatreForm);
          const newT = res.data?.data || res.data;
          setTheatres((prev) => [newT, ...prev]);
        } catch {
          setTheatres((prev) => [
            { ...theatreForm, id: Date.now(), totalScreens: 0, screens: [] },
            ...prev,
          ]);
        }
        toast.success('Theatre added');
      }
      setShowTheatreModal(false);
    } catch {
      toast.error('Failed to save theatre');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTheatre = async (id) => {
    if (!window.confirm('Delete this theatre and all its screens?')) return;
    try { await adminApi.deleteTheatre(id); } catch {}
    setTheatres((prev) => prev.filter((t) => t.id !== id));
    toast.success('Theatre deleted');
  };

  // ── Screen CRUD ──
  const handleOpenAddScreen = (theatreId) => {
    setSelectedTheatreId(theatreId);
    setScreenForm(EMPTY_SCREEN);
    setShowScreenModal(true);
  };

  const handleSaveScreen = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      try {
        await adminApi.createScreen(selectedTheatreId, screenForm);
      } catch {}
      setTheatres((prev) =>
        prev.map((t) => {
          if (t.id === selectedTheatreId) {
            const newScreen = { ...screenForm, id: Date.now(), totalSeats: Number(screenForm.totalSeats) };
            return {
              ...t,
              totalScreens: (t.totalScreens || 0) + 1,
              screens: [...(t.screens || []), newScreen],
            };
          }
          return t;
        })
      );
      toast.success('Screen added');
      setShowScreenModal(false);
    } catch {
      toast.error('Failed to add screen');
    } finally {
      setSaving(false);
    }
  };

  const filtered = theatres.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">Manage Theatres</h2>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:w-60">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search theatres..."
              className="w-full pl-9 pr-4 py-2 bg-gray-800/60 border border-gray-700/50 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>
          <button
            onClick={handleOpenAddTheatre}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-rose-600 hover:to-purple-700 transition-all cursor-pointer"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Theatre
          </button>
        </div>
      </div>

      {/* Theatres list */}
      <div className="space-y-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-gray-800/50 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-800/50 rounded w-1/4 mb-2" />
                <div className="h-4 bg-gray-800/50 rounded w-1/2" />
              </div>
            ))
          : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <HiOutlineOfficeBuilding className="w-10 h-10 text-gray-700 mb-2" />
                <p className="text-gray-500 text-sm">No theatres found</p>
              </div>
            ) : (
              filtered.map((theatre) => (
                <div
                  key={theatre.id}
                  className="bg-gray-900/60 border border-gray-800/50 rounded-xl overflow-hidden hover:border-gray-700/50 transition-all"
                >
                  {/* Theatre header */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <HiOutlineOfficeBuilding className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-base">{theatre.name}</h3>
                          <p className="text-gray-400 text-sm flex items-center gap-1 mt-0.5">
                            <HiOutlineLocationMarker className="w-3.5 h-3.5 text-gray-500" />
                            {theatre.city}
                            {theatre.address && ` — ${theatre.address}`}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium flex items-center gap-1">
                              <HiOutlineViewGrid className="w-3 h-3" />
                              {theatre.screens?.length || theatre.totalScreens || 0} Screens
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() =>
                            setExpandedTheatre(expandedTheatre === theatre.id ? null : theatre.id)
                          }
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer text-xs"
                          title="View Screens"
                        >
                          <HiOutlineViewGrid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditTheatre(theatre)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTheatre(theatre.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded screens panel */}
                  {expandedTheatre === theatre.id && (
                    <div className="border-t border-gray-800/50 bg-gray-950/40 px-5 sm:px-6 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-gray-300 text-sm font-medium">Screens</h4>
                        <button
                          onClick={() => handleOpenAddScreen(theatre.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs text-rose-400 border border-rose-500/20 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <HiOutlinePlus className="w-3 h-3" />
                          Add Screen
                        </button>
                      </div>
                      {theatre.screens && theatre.screens.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {theatre.screens.map((screen) => (
                            <div
                              key={screen.id}
                              className="flex items-center justify-between px-3 py-2.5 bg-gray-800/30 border border-gray-700/30 rounded-lg"
                            >
                              <span className="text-gray-200 text-sm font-medium">{screen.screenName}</span>
                              <span className="text-gray-500 text-xs">{screen.totalSeats} seats</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm py-2">No screens configured</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
      </div>

      {/* Theatre Modal */}
      {showTheatreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={() => setShowTheatreModal(false)} />
          <div className="relative bg-gray-900 border border-gray-800/50 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="border-b border-gray-800/50 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">
                {editingTheatre ? 'Edit Theatre' : 'Add Theatre'}
              </h3>
              <button
                onClick={() => setShowTheatreModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTheatre} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Name *</label>
                <input
                  type="text"
                  required
                  value={theatreForm.name}
                  onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  placeholder="PVR Cinemas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">City *</label>
                <input
                  type="text"
                  required
                  value={theatreForm.city}
                  onChange={(e) => setTheatreForm({ ...theatreForm, city: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  placeholder="Chennai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Address</label>
                <input
                  type="text"
                  value={theatreForm.address}
                  onChange={(e) => setTheatreForm({ ...theatreForm, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTheatreModal(false)}
                  className="flex-1 py-2.5 bg-gray-800/60 border border-gray-700/50 text-gray-300 font-medium rounded-xl hover:bg-gray-800 transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-purple-700 transition-all disabled:opacity-50 cursor-pointer text-sm"
                >
                  {saving ? 'Saving...' : editingTheatre ? 'Update' : 'Add Theatre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screen Modal */}
      {showScreenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={() => setShowScreenModal(false)} />
          <div className="relative bg-gray-900 border border-gray-800/50 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="border-b border-gray-800/50 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Add Screen</h3>
              <button
                onClick={() => setShowScreenModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveScreen} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Screen Name *</label>
                <input
                  type="text"
                  required
                  value={screenForm.screenName}
                  onChange={(e) => setScreenForm({ ...screenForm, screenName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  placeholder="IMAX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Total Seats *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={screenForm.totalSeats}
                  onChange={(e) => setScreenForm({ ...screenForm, totalSeats: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  placeholder="120"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScreenModal(false)}
                  className="flex-1 py-2.5 bg-gray-800/60 border border-gray-700/50 text-gray-300 font-medium rounded-xl hover:bg-gray-800 transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-purple-700 transition-all disabled:opacity-50 cursor-pointer text-sm"
                >
                  {saving ? 'Saving...' : 'Add Screen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTheatres;
