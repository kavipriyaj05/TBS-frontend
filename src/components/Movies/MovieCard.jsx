// ═══ FILE: src/components/Movies/MovieCard.jsx ═══
// Individual movie card with hover effects — Kavi
import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineStar } from 'react-icons/hi';
import { getMoviePoster } from '../../utils/moviePosters';

const MovieCard = ({ movie }) => {
  const posterSrc = getMoviePoster(movie);

  // Fallback poster gradient when no image is available
  const fallbackGradient = `linear-gradient(135deg, 
    hsl(${(movie.id * 47) % 360}, 70%, 25%), 
    hsl(${(movie.id * 47 + 60) % 360}, 70%, 15%))`;

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group block"
      id={`movie-card-${movie.id}`}
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-900 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-1">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {posterSrc ? (
            <img
              src={posterSrc}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: fallbackGradient }}
            >
              <span className="text-4xl font-bold text-white/20">
                {movie.title?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />

          {/* Language badge */}
          {movie.language && (
            <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-gray-950/70 backdrop-blur-sm text-gray-300 text-xs font-medium rounded-full border border-gray-700/50">
              {movie.language}
            </span>
          )}

          {/* Rating badge placeholder */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
            <HiOutlineStar className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-300 text-xs font-semibold">4.5</span>
          </div>

          {/* Hover overlay with "Book Now" */}
          <div className="absolute inset-0 bg-gradient-to-t from-rose-500/30 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <span className="px-6 py-2 bg-white/95 text-gray-900 text-sm font-semibold rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Book Now →
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm truncate group-hover:text-rose-400 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-500 text-xs truncate max-w-[60%]">
              {movie.genre || 'Genre N/A'}
            </span>
            {movie.durationMin && (
              <span className="flex items-center gap-1 text-gray-500 text-xs">
                <HiOutlineClock className="w-3 h-3" />
                {movie.durationMin}m
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
