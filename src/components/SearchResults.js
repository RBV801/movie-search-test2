import React, { useState, useEffect } from 'react';
import ImageWithFallback from './ImageWithFallback';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/search?query=judy garland`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setSearchResults(data.Search);
        setTotalResults(data.totalResults);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching search results:', error);
      }
    };

    fetchSearchResults();
  }, []);

  const handleMoreResults = () => {
    setCurrentPage(currentPage + 1);
    // Fetch additional results
  };

  return (
    <div>
      <h2>Search Results</h2>
      {error && <div className="error">{error}</div>}
      <div className="results-container">
        {searchResults.map((movie) => (
          <div key={movie.id} className="movie-card">
            <ImageWithFallback
              src={`/api/poster/${movie.id}`}
              alt={`${movie.title} poster`}
              className="movie-poster"
            />
            <h3>{movie.title}</h3>
            <p>Year: {movie.year}</p>
            <p>Actors: {movie.actors.join(', ')}</p>
          </div>
        ))}
      </div>
      {totalResults > searchResults.length && (
        <button onClick={handleMoreResults}>More Results</button>
      )}
    </div>
  );
};

export default SearchResults;