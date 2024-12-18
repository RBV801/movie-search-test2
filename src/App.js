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
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSubmitFeedback, setShowSubmitFeedback] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showFeedbackWidget, setShowFeedbackWidget] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState({
    matchFactors: [],
    aiUsage: { creditsUsed: 0, operations: [] }
  });

  // Load search history on component mount
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  // Show feedback widget after search completes
  useEffect(() => {
    if (!loading && results.length > 0) {
      const timer = setTimeout(() => {
        setShowFeedbackWidget(true);
      }, 2000); // Show feedback widget 2 seconds after results load

      return () => clearTimeout(timer);
    }
  }, [loading, results.length]);

  // Initialize speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      handleSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
  }

  const toggleVoiceSearch = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setShowSubmitFeedback(true);
    setTimeout(() => setShowSubmitFeedback(false), 2000);
    handleSearch(searchQuery, 1);
  };

  const handleHistoryItemClick = (historyItem) => {
    setSearchQuery(historyItem.query);
    handleSearch(historyItem.query, 1);
  };

  const handleClearHistory = () => {
    const clearedHistory = clearSearchHistory();
    setSearchHistory(clearedHistory);
  };

  const handleFeedbackSubmit = (feedback) => {
    saveFeedback(feedback);
    setShowFeedbackWidget(false);
  };

  const loadMore = () => {
    if (loading || !hasMore) return;
    handleSearch(searchQuery, currentPage + 1);
  };

  const renderStreamingProviders = (providers) => {
    if (!providers) return null;

    return (
      <div className="streaming-providers">
        <h4>Available on:</h4>
        {providers.flatrate?.map(provider => (
          <span key={provider.provider_id} className="provider-badge">
            {provider.provider_name}
          </span>
        ))}
        {providers.rent?.map(provider => (
          <span key={provider.provider_id} className="provider-badge rent">
            Rent on {provider.provider_name}
          </span>
        ))}
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>Movie Search</h1>
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="search-input"
              />
              <button 
                type="button" 
                onClick={toggleVoiceSearch} 
                className={`voice-button ${isListening ? 'recording' : ''}`}
                aria-label="Voice search"
                title="Click to search with your voice"
              >
                {isListening ? (
                  <span role="img" aria-label="Recording">🔴 Recording...</span>
                ) : (
                  <span role="img" aria-label="Microphone">🎤</span>
                )}
              </button>
              <button type="submit" className="search-button">
                Search
              </button>
            </div>
          </form>
        </header>

        <main className="App-main">
          {error && <div className="error-message">{error}</div>}

          {!loading && searchHistory.length > 0 && (
            <SearchHistory
              history={searchHistory}
              onHistoryItemClick={handleHistoryItemClick}
              onClearHistory={handleClearHistory}
            />
          )}

          {!loading && <SearchFeedback 
            totalResults={totalResults}
            currentPage={currentPage}
            resultsPerPage={10}
          />}

          {!loading && totalResults > 0 && (
            <AISearchExplanation
              searchTerm={searchQuery}
              resultCount={totalResults}
              matchFactors={aiAnalysis.matchFactors}
              aiUsage={aiAnalysis.aiUsage}
            />
          )}

          <div className="results-grid">
            {results.map((movie, index) => (
              <div key={`${movie.id || movie.imdbID}-${index}`} className="movie-card">
                <div className="movie-poster">
                  <ImageWithFallback
                    src={
                      movie.tmdbData?.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.tmdbData.poster_path}`
                        : (movie.poster || null)
                    }
                    alt={movie.title || 'Movie Poster'}
                    className="movie-poster-image"
                  />
                </div>
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p className="year">{movie.year}</p>
                  {movie.recommendationScore && (
                    <div className="recommendation-score">
                      <span className="score-label">Recommendation Score:</span>
                      <span className="score-value">{movie.recommendationScore}</span>
                    </div>
                  )}
                  {movie.tmdbData && (
                    <>
                      <p className="overview">{movie.tmdbData.overview}</p>
                      <div className="genres">
                        {movie.genres?.map(genre => (
                          <span key={genre} className="genre-tag">{genre}</span>
                        ))}
                      </div>
                      {movie.keywords?.length > 0 && (
                        <div className="keywords">
                          {movie.keywords.map(keyword => (
                            <span key={keyword} className="keyword-tag">{keyword}</span>
                          ))}
                        </div>
                      )}
                      {renderStreamingProviders(movie.tmdbData.streamingProviders)}
                    </>
                  )}
                  {movie.omdbData && (
                    <div className="ratings">
                      {movie.omdbData.Ratings?.map(rating => (
                        <div key={rating.Source} className="rating">
                          <span className="rating-source">{rating.Source}:</span>
                          <span className="rating-value">{rating.Value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {loading && <LoadingState />}

          {hasMore && !loading && results.length > 0 && (
            <button 
              onClick={loadMore} 
              className="load-more-button"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Results'}
            </button>
          )}

          {showSubmitFeedback && (
            <div className="submit-feedback">
              Search submitted!
            </div>
          )}

          {showFeedbackWidget && !loading && results.length > 0 && (
            <FeedbackWidget
              onSubmit={handleFeedbackSubmit}
              searchQuery={searchQuery}
            />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;