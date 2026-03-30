// ═══ FILE: src/pages/MovieDetailPage.jsx ═══
// Movie detail page with show listings — connected to backend
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import movieApi from '../api/movieApi';
import showApi from '../api/showApi';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import {
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineGlobe,
  HiOutlineFilm,
  HiOutlineStar,
  HiArrowLeft,
  HiOutlineLocationMarker,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { getMoviePoster } from '../utils/moviePosters';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        // Fetch movie details
        const response = await movieApi.getMovieById(id);
        const movieData = response.data?.data || response.data;
        setMovie(movieData);

        // Fetch shows for this movie
        const showResponse = await showApi.getShowsByMovie(id);
        setShows(showResponse.data?.data || showResponse.data || []);
      } catch (err) {
        toast.error('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Generate next 7 dates for date picker
  const getNextDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    };
  };

  const formatShowTime = (datetime) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Group shows by theatre — adapted to flat ShowResponse
  // ShowResponse has: theatreName, theatreCity, screenName (flat, not nested)
  const filteredShows = selectedDate
    ? shows.filter((show) => {
        const showDate = show.showTime?.split('T')[0];
        return showDate === selectedDate;
      })
    : shows;

  const groupedShows = filteredShows.reduce((acc, show) => {
    const theatreKey = show.theatreName || 'Unknown Theatre';
    if (!acc[theatreKey]) {
      acc[theatreKey] = {
        theatre: { name: show.theatreName, city: show.theatreCity },
        shows: [],
      };
    }
    acc[theatreKey].shows.push(show);
    return acc;
  }, {});

  if (loading) return <LoadingSpinner text="Loading movie details..." fullScreen />;

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <HiOutlineFilm className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
          <p className="text-gray-500 mb-6">The movie you're looking for doesn't exist.</p>
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

  const fallbackGradient = `linear-gradient(135deg, hsl(${(movie.id * 47) % 360}, 70%, 20%), hsl(${(movie.id * 47 + 80) % 360}, 60%, 10%))`;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 opacity-30 blur-xl scale-110"
          style={{ background: fallbackGradient }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/80 to-gray-950" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors group"
          >
            <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Movies
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster */}
            <div className="w-48 md:w-64 flex-shrink-0">
              <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-rose-500/10 border border-gray-800/50">
                {getMoviePoster(movie) ? (
                  <img
                    src={getMoviePoster(movie)}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: fallbackGradient }}
                  >
                    <span className="text-6xl font-bold text-white/20">
                      {movie.title?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                {movie.title}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {movie.genre && (
                  <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-xs font-medium">
                    {movie.genre}
                  </span>
                )}
                {movie.language && (
                  <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-medium">
                    {movie.language}
                  </span>
                )}
                <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-xs font-medium">
                  <HiOutlineStar className="w-3 h-3" /> 4.5/5
                </span>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6">
                {movie.durationMin && (
                  <span className="flex items-center gap-1.5">
                    <HiOutlineClock className="w-4 h-4 text-gray-500" />
                    {Math.floor(movie.durationMin / 60)}h {movie.durationMin % 60}m
                  </span>
                )}
                {movie.releaseDate && (
                  <span className="flex items-center gap-1.5">
                    <HiOutlineCalendar className="w-4 h-4 text-gray-500" />
                    {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                )}
                {movie.language && (
                  <span className="flex items-center gap-1.5">
                    <HiOutlineGlobe className="w-4 h-4 text-gray-500" />
                    {movie.language}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">
                  About the Movie
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                  {movie.description || 'No description available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold text-white mb-6">Select Showtime</h2>

        {/* Date Picker */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {getNextDates().map((dateStr) => {
            const { day, date, month } = formatDate(dateStr);
            const isSelected = selectedDate === dateStr;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? '' : dateStr)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all cursor-pointer min-w-[72px] ${
                  isSelected
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                    : 'bg-gray-800/40 border-gray-700/50 text-gray-400 hover:border-gray-600'
                }`}
              >
                <span className="text-xs font-medium uppercase">{day}</span>
                <span className="text-lg font-bold">{date}</span>
                <span className="text-xs">{month}</span>
              </button>
            );
          })}
        </div>

        {/* Theatres & Shows */}
        <div className="space-y-4">
          {Object.keys(groupedShows).length === 0 ? (
            <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-8 text-center">
              <HiOutlineFilm className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No shows available</p>
              <p className="text-gray-600 text-sm mt-1">
                {selectedDate ? 'Select a different date or check back later.' : 'No shows are currently scheduled for this movie.'}
              </p>
            </div>
          ) : (
            Object.entries(groupedShows).map(([theatreName, { theatre, shows: theatreShows }]) => (
              <div
                key={theatreName}
                className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">{theatreName}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                      <HiOutlineLocationMarker className="w-3 h-3" />
                      {theatre?.city || 'City N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {theatreShows.map((show) => (
                    <Link
                      key={show.id}
                      to={`/shows/${show.id}/seats`}
                      className="group px-5 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-lg hover:border-rose-500/50 hover:bg-rose-500/5 transition-all"
                    >
                      <span className="text-emerald-400 font-semibold text-sm group-hover:text-rose-400 transition-colors">
                        {formatShowTime(show.showTime)}
                      </span>
                      <span className="block text-gray-500 text-xs mt-0.5">
                        ₹{Number(show.price)?.toFixed(0)} • {show.screenName}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default MovieDetailPage;
