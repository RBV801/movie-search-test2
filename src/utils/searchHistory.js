const HISTORY_KEY = 'movie_search_history';
const MAX_HISTORY_ITEMS = 10;

export const getSearchHistory = () => {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const addToSearchHistory = (query, totalResults) => {
  const history = getSearchHistory();
  const newHistory = [
    { query, totalResults, timestamp: Date.now() },
    ...history.filter(item => item.query !== query)
  ].slice(0, MAX_HISTORY_ITEMS);
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  return newHistory;
};

export const clearSearchHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
  return [];
};