import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/components.css';
import ImageWithFallback from './components/ImageWithFallback';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingState from './components/LoadingState';
import SearchFeedback from './components/SearchFeedback';
import SearchHistory from './components/SearchHistory';
import FeedbackWidget from './components/FeedbackWidget';
import AISearchExplanation from './components/AISearchExplanation';
import { analyzeSearchIntent } from './utils/searchAnalysis';
import { getCachedData, setCachedData } from './utils/caching';
import { getSearchHistory, addToSearchHistory, clearSearchHistory } from './utils/searchHistory';
import { saveFeedback } from './utils/feedbackStorage';

function App() {
  // ...existing code...

  const handleSearch = async (query = searchQuery, page = 1, retryCount = 0) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setShowFeedbackWidget(false);

    if (page === 1) {
      setResults([]); // Clear previous results when starting a new search
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top for new searches
      
      // Perform AI analysis on new searches
      const analysis = analyzeSearchIntent(query);
      setAiAnalysis(analysis);
    }

    // Check cache first
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

      if (data.error) {
        throw new Error(data.error);
      }

      // Cache the successful response
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
        // Retry with exponential backoff
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return handleSearch(query, page, retryCount + 1);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...
}