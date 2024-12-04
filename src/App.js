feature/search-improvements
import React, { useState } from 'react'
main
import './App.css';
import MovieSearch from './MovieSearch';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Movie Search</h1>
      </header>
feature/search-improvements

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
                <img 
                  src={movie.tmdbData?.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.tmdbData.poster_path}`
                    : (movie.poster || '/placeholder-image.jpg')} 
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
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
main
    </div>
  );
}

export default App;