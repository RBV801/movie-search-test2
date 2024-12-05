
import React, { useState } from 'react';
import debounce from './utils/debounce';
import { analyzeSearchIntent } from './utils/searchAnalysis';
import { getCachedData, setCachedData } from './utils/caching';
import { getSearchHistory, addToSearchHistory } from './utils/searchHistory';
import LoadingState from './components/LoadingState';

function App() {
  const [loading, setLoading] = useState(false);

  const handleSearch = debounce(async (query, page = 1, retryCount = 0) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setShowFeedbackWidget(false);
    if (page === 1) {
      setResults([]); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const analysis = analyzeSearchIntent(query);
      setAiAnalysis(analysis);
    }
    const cacheKey = `${query}-${page}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      const newResults = page === 1 ? cachedData.Search : [...results, ...cachedData.Search];
      setResults(newResults);
      setTotalResults(cachedData.totalResults);
      setCurrentPage(page);
      setHasMore(newResults.length < cachedData.totalResults);
      if (page === 1) {
        const newHistory = addToSearchHistory(query, cachedData.totalResults);
        setSearchHistory(newHistory);
      }
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/search?query=${encodeURIComponent(query)}&page=${page}`
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setCachedData(cacheKey, data);
      let newResults;
      if (page === 1) {
        newResults = data.Search || [];
        const newHistory = addToSearchHistory(query, data.totalResults);
        setSearchHistory(newHistory);
      } else {
        newResults = [...results, ...(data.Search || [])];
      }
      setResults(newResults);
      setTotalResults(data.totalResults);
      setCurrentPage(page);
      setHasMore(newResults.length < data.totalResults);
    } catch (err) {
      console.error('Search error:', err);
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return handleSearch(query, page, retryCount + 1);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, 500);

  return (
    loading ? <LoadingState /> : // Render loading state
    // Other components
  );
}
