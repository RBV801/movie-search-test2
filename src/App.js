import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import debounce from './utils/debounce';
import { analyzeSearchIntent } from './utils/searchAnalysis';
import { getCachedData, setCachedData } from './utils/caching';
import { getSearchHistory, addToSearchHistory } from './utils/searchHistory';
import LoadingState from './components/LoadingState';
import SearchResults from './components/SearchResults';
import SearchHistory from './components/SearchHistory';
import Pagination from './components/Pagination';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const handleSearch = debounce(async (query, page = 1) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    if (page === 1) {
      setResults([]);
      const analysis = analyzeSearchIntent(query);
      setAiAnalysis(analysis);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/search?query=${encodeURIComponent(query)}&page=${page}`
      );
      const data = await response.json();
      
      if (data.Error) throw new Error(data.Error);
      
      const newResults = page === 1 ? data.Search : [...results, ...data.Search];
      setResults(newResults);
      setTotalResults(parseInt(data.totalResults) || 0);
      setCurrentPage(page);
      setHasMore(newResults.length < data.totalResults);
      
      if (page === 1) {
        addToSearchHistory(query, data.totalResults);
        setSearchHistory(getSearchHistory());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, 500);

  const toggleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser');
      return;
    }
    setIsListening(!isListening);
    // Voice recognition implementation
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-6">Movie Search</h1>
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search for movies..."
              className="w-full p-4 pr-12 rounded-lg border shadow-sm"
            />
            <button
              onClick={toggleVoiceSearch}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full ${isListening ? 'bg-red-100' : 'hover:bg-gray-100'}`}
            >
              <Mic className={isListening ? 'text-red-500' : 'text-gray-500'} />
            </button>
          </div>
        </header>

        <main className="flex gap-6">
          <div className="flex-grow">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">{error}</div>
            )}
            
            {loading ? (
              <LoadingState />
            ) : (
              <>
                <SearchResults results={results} />
                {totalResults > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalResults={totalResults}
                    hasMore={hasMore}
                    onPageChange={(page) => handleSearch(searchQuery, page)}
                  />
                )}
              </>
            )}
          </div>

          <aside className="w-80 shrink-0">
            <SearchHistory
              history={searchHistory}
              onHistoryItemClick={(query) => {
                setSearchQuery(query);
                handleSearch(query);
              }}
            />
            {aiAnalysis && (
              <div className="bg-white rounded-lg shadow p-4 mt-4">
                <h3 className="font-bold mb-2">AI Analysis</h3>
                <div className="space-y-2">
                  {aiAnalysis.matchFactors.map((factor, index) => (
                    <div key={index} className="text-sm text-gray-600">{factor}</div>
                  ))}
                  <div className="text-xs text-purple-600 mt-2">
                    Credits used: {aiAnalysis.aiUsage.creditsUsed}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App;