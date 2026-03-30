// Local poster image mappings for movies
// Import local images from assets folder
import dhurandhar2 from '../assets/dgurundhar 2.jpg';

// Map movie titles (lowercased) to local poster images
const LOCAL_POSTERS = {
  'dhurandhar 2': dhurandhar2,
  'dhurandhar-2': dhurandhar2,
  'dgurundhar 2': dhurandhar2,
};

/**
 * Returns the poster URL for a movie.
 * Falls back to local assets if posterUrl from backend is empty.
 */
export const getMoviePoster = (movie) => {
  if (movie?.posterUrl) return movie.posterUrl;
  const key = movie?.title?.toLowerCase()?.trim();
  return key ? LOCAL_POSTERS[key] || null : null;
};
