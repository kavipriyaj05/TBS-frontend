// ═══ FILE: src/components/Movies/MovieGrid.jsx ═══
// Grid layout for movie cards with empty state — Kavi
import MovieCard from './MovieCard';
import { HiOutlineFilm } from 'react-icons/hi';

const MovieGrid = ({ movies, loading }) => {
  if (!loading && (!movies || movies.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-20 h-20 bg-gray-800/50 rounded-2xl flex items-center justify-center mb-4">
          <HiOutlineFilm className="w-10 h-10 text-gray-600" />
        </div>
        <h3 className="text-gray-400 text-lg font-semibold mb-1">No Movies Found</h3>
        <p className="text-gray-600 text-sm text-center max-w-sm">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {loading
        ? // Skeleton loading cards
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-gray-800/50 rounded-xl" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-800/50 rounded w-3/4" />
                <div className="h-3 bg-gray-800/50 rounded w-1/2" />
              </div>
            </div>
          ))
        : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
    </div>
  );
};

export default MovieGrid;
