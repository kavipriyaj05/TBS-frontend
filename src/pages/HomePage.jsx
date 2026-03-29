// ═══ FILE: src/pages/HomePage.jsx ═══
// Homepage with hero banner, movie grid, search, and filters — Kavi
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import movieApi from '../api/movieApi';
import MovieGrid from '../components/Movies/MovieGrid';
import MovieFilters from '../components/Movies/MovieFilters';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { HiOutlineFilm, HiOutlineTicket, HiOutlineLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';

// Mock data for demo until backend is connected
const MOCK_MOVIES = [
  { id: 1, title: 'Inception', genre: 'Sci-Fi', language: 'English', durationMin: 148, posterUrl: '', description: 'A thief who steals corporate secrets through dream-sharing technology.', releaseDate: '2025-07-16', isActive: true },
  { id: 2, title: 'The Dark Knight', genre: 'Action', language: 'English', durationMin: 152, posterUrl: '', description: 'Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy.', releaseDate: '2025-07-18', isActive: true },
  { id: 3, title: 'Interstellar', genre: 'Sci-Fi', language: 'English', durationMin: 169, posterUrl: '', description: 'A team of explorers travel through a wormhole in space.', releaseDate: '2025-11-07', isActive: true },
  { id: 4, title: 'Parasite', genre: 'Thriller', language: 'Hindi', durationMin: 132, posterUrl: '', description: 'Greed and class discrimination threaten the newly formed symbiotic relationship.', releaseDate: '2025-05-30', isActive: true },
  { id: 5, title: 'Dangal', genre: 'Drama', language: 'Hindi', durationMin: 161, posterUrl: '', description: 'Former wrestler Mahavir Singh Phogat trains his daughters for wrestling.', releaseDate: '2025-12-23', isActive: true },
  { id: 6, title: 'Bahubali', genre: 'Action', language: 'Telugu', durationMin: 159, posterUrl: '', description: 'An epic historical fiction film.', releaseDate: '2025-07-10', isActive: true },
  { id: 7, title: 'Vikram', genre: 'Action', language: 'Tamil', durationMin: 174, posterUrl: '', description: 'A special agent investigates a series of murders.', releaseDate: '2025-06-03', isActive: true },
  { id: 8, title: 'KGF Chapter 2', genre: 'Action', language: 'Kannada', durationMin: 168, posterUrl: '', description: 'Rocky takes over the gold mines and his enemies try to take him down.', releaseDate: '2025-04-14', isActive: true },
  { id: 9, title: 'Dune: Part Two', genre: 'Sci-Fi', language: 'English', durationMin: 166, posterUrl: '', description: 'Paul Atreides unites with Chani and the Fremen.', releaseDate: '2025-03-01', isActive: true },
  { id: 10, title: 'RRR', genre: 'Action', language: 'Telugu', durationMin: 187, posterUrl: '', description: 'A fictitious story about two legendary revolutionaries.', releaseDate: '2025-03-25', isActive: true },
];

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', language: '' });
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      // Try API first, fall back to mock data if backend is not running
      const params = {};
      if (filters.genre) params.genre = filters.genre;
      if (filters.language) params.language = filters.language;

      let data;
      try {
        const response = searchQuery
          ? await movieApi.searchMovies(searchQuery)
          : await movieApi.getAllMovies(params);
        data = response.data?.data || response.data || [];
      } catch {
        // Backend not available — use mock data
        data = MOCK_MOVIES;
      }

      // Apply client-side filters on mock data
      let filtered = Array.isArray(data) ? data : [];
      if (filters.genre) {
        filtered = filtered.filter((m) => m.genre?.toLowerCase() === filters.genre.toLowerCase());
      }
      if (filters.language) {
        filtered = filtered.filter((m) => m.language?.toLowerCase() === filters.language.toLowerCase());
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.title?.toLowerCase().includes(q) ||
            m.genre?.toLowerCase().includes(q)
        );
      }

      setMovies(filtered);
    } catch (err) {
      toast.error('Failed to load movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleClearFilters = () => {
    setFilters({ genre: '', language: '' });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 via-purple-500/5 to-gray-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 blur-3xl rounded-full opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full mb-6">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              <span className="text-rose-400 text-xs font-medium tracking-wide uppercase">
                Now Showing
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Book Your Next{' '}
              <span className="bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Movie Experience
              </span>
            </h1>

            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Discover and book tickets for the latest blockbusters, indie gems, and everything in between.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 sm:gap-12">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center">
                  <HiOutlineFilm className="w-5 h-5 text-rose-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg">500+</p>
                  <p className="text-gray-500 text-xs">Movies</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <HiOutlineLocationMarker className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg">120+</p>
                  <p className="text-gray-500 text-xs">Theatres</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <HiOutlineTicket className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg">1M+</p>
                  <p className="text-gray-500 text-xs">Bookings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {searchQuery ? `Search: "${searchQuery}"` : 'Now Showing'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {movies.length} movie{movies.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {/* Filters */}
        <MovieFilters
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Movie Grid */}
        {loading ? (
          <LoadingSpinner text="Loading movies..." />
        ) : (
          <MovieGrid movies={movies} loading={false} />
        )}
      </section>
    </div>
  );
};

export default HomePage;
