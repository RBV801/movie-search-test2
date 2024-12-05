import React, { useState, useEffect } from 'react';
import ImageWithFallback from './ImageWithFallback';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`/api/search?q=judy garland`);
        const data = await response.json();
        setSearchResults(data.results);
        setTotalResults(data.totalResults);
      } catch (error) {
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