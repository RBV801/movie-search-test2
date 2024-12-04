// Constants for image handling
export const IMAGE_SIZES = {
  POSTER: {
    THUMBNAIL: 'w200',
    MEDIUM: 'w500',
    LARGE: 'original'
  }
};

// Validate and build TMDB image URL
export const buildTMDBImageUrl = (path, size = IMAGE_SIZES.POSTER.MEDIUM) => {
  if (!path) return null;
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `https://image.tmdb.org/t/p/${size}${cleanPath}`;
};

// Fallback function for when TMDB image fails
export const getMoviePosterFallback = (movie) => {
  if (!movie) return null;
  
  // Try different sources in order of preference
  return movie.poster ||
         (movie.omdbData && movie.omdbData.Poster) ||
         null;
};
