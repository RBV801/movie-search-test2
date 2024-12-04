import React from 'react';
import ImageWithFallback from './ImageWithFallback';
import { buildTMDBImageUrl, getMoviePosterFallback } from '../utils/imageUtils';

const MovieCard = ({ movie }) => {
  const posterUrl = movie.tmdbData?.poster_path
    ? buildTMDBImageUrl(movie.tmdbData.poster_path)
    : getMoviePosterFallback(movie);

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
    <div className="movie-card">
      <div className="movie-poster">
        <ImageWithFallback
          src={posterUrl}
          alt={`${movie.title} poster`}
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
  );
};

export default MovieCard;