const HISTORY_KEY = 'movieSearchHistory';
const MAX_HISTORY_ITEMS = 10;

export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading search history:', error);
    return [];
  }
};

export const addToSearchHistory = (query, totalResults) => {
  try {
    const history = getSearchHistory();
    const newItem = {
      query,
      timestamp: Date.now(),
      totalResults
    };

    // Remove duplicate queries (keep most recent)
    const filteredHistory = history.filter(item => item.query !== query);
    
    // Add new item to the beginning
    const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('Error saving to search history:', error);
    return [];
  }
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return [];
  } catch (error) {
    console.error('Error clearing search history:', error);
    return [];
  }
};
