const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const setCachedData = (key, data) => {
  const cacheItem = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(`movie_search_${key}`, JSON.stringify(cacheItem));
};

export const getCachedData = (key) => {
  const cached = localStorage.getItem(`movie_search_${key}`);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(`movie_search_${key}`);
    return null;
  }

  return data;
};