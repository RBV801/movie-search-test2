import React from 'react';
import ImageWithFallback from './ImageWithFallback';

const SearchResults = ({ results = [], error }) => {
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h2>Search Results</h2>
      <div className="results-container">
        {results.map((movie) => (
          <div key={movie.id} className="movie-card">
            <ImageWithFallback
              src={`${process.env.REACT_APP_API_URL}/api/poster/${movie.id}`}
              alt={`${movie.title} poster`}
              className="movie-poster"
            />
            <h3>{movie.title}</h3>
            <p>Year: {movie.year}</p>
            <p>Actors: {movie.actors.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;