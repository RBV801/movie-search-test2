import React, { useState } from 'react';
import './App.css';
import ImageWithFallback from './components/ImageWithFallback';
import ErrorBoundary from './components/ErrorBoundary';
import { getCachedData, setCachedData } from './utils/caching';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isListening, setIsListening] = useState(false);

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

    // Check cache first
    const cacheKey = `${query}-${page}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      setResults(page === 1 ? cachedData.Search : [...results, ...cachedData.Search]);
      setTotalResults(cachedData.totalResults);
      setCurrentPage(cachedData.currentPage);
      setHasMore(cachedData.hasMore);
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

      if (page === 1) {
        setResults(data.Search || []);
      } else {
        setResults(prev => [...prev, ...(data.Search || [])]);
      }

      setTotalResults(data.totalResults);
      setCurrentPage(data.currentPage);
      setHasMore(data.hasMore);
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
    handleSearch(searchQuery, 1);
  };

  const loadMore = () => {
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
                {isListening ? '🔴 Recording...' : '🎤'}
              </button>
              <button type="submit" className="search-button">
                Search
              </button>
            </div>
          </form>
        </header>

        <main className="App-main">
          {error && <div className="error-message">{error}</div>}
          
          {totalResults > 0 && (
            <div className="results-count">
              Found {totalResults} results
            </div>
          )}

          {results.length === 0 && !loading && !error && searchQuery && (
            <div className="no-results">
              No results found. Try adjusting your search terms.
            </div>
          )}

          <div className="results-grid">
            {results.map((movie, index) => (
              <div key={`${movie.id || movie.imdbID}-${index}`} className="movie-card">
                <div className="movie-poster">
                  <ImageWithFallback
                    src={movie.tmdbData?.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${movie.tmdbData.poster_path}`
                      : movie.poster}
                    alt={movie.title}
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

          {hasMore && !loading && results.length > 0 && (
            <button onClick={loadMore} className="load-more-button">
              Load More Results
            </button>
          )}

          {loading && (
            <div className="loading-spinner">
              Loading...
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;