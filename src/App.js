/* Previous imports remain the same */

function App() {
  // ... previous state declarations remain the same ...

  const handleSearch = async (query = searchQuery, page = 1, retryCount = 0) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setShowFeedbackWidget(false);

    if (page === 1) {
      setResults([]); // Clear previous results when starting a new search
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top for new searches
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

  const loadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = currentPage + 1;
    handleSearch(searchQuery, nextPage);
  };

  // ... rest of the component remains the same ...

  return (
    <ErrorBoundary>
      <div className="App">
        {/* ... header section remains the same ... */}

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

          {/* ... results grid remains the same ... */}

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