// ═══ FILE: src/components/Movies/MovieFilters.jsx ═══
// Genre and language filter bar — Kavi
import { GENRES, LANGUAGES } from '../../utils/constants';
import { HiOutlineFilter, HiOutlineX } from 'react-icons/hi';

const MovieFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const hasActiveFilters = filters.genre || filters.language;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
        <HiOutlineFilter className="w-4 h-4" />
        <span>Filters</span>
      </div>

      {/* Genre filter */}
      <select
        id="genre-filter"
        value={filters.genre || ''}
        onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
        className="px-3 py-2 bg-gray-800/60 border border-gray-700/50 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer appearance-none"
      >
        <option value="">All Genres</option>
        {GENRES.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      {/* Language filter */}
      <select
        id="language-filter"
        value={filters.language || ''}
        onChange={(e) => onFilterChange({ ...filters, language: e.target.value })}
        className="px-3 py-2 bg-gray-800/60 border border-gray-700/50 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer appearance-none"
      >
        <option value="">All Languages</option>
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm hover:bg-rose-500/20 transition-colors cursor-pointer"
        >
          <HiOutlineX className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  );
};

export default MovieFilters;
