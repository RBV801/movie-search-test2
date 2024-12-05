import React from 'react';
import { Film } from 'lucide-react';

const SearchResults = ({ results, error }) => {
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!results.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((movie, index) => (
        <div key={`${movie.imdbID}-${index}`} className="bg-white rounded-lg shadow p-4">
          <div className="aspect-w-2 aspect-h-3 mb-4">
            {movie.Poster && movie.Poster !== 'N/A' ? (
              <img src={movie.Poster} alt={movie.Title} className="rounded object-cover" />
            ) : (
              <div className="flex items-center justify-center bg-gray-200 rounded">
                <Film size={48} className="text-gray-400" />
              </div>
            )}
          </div>
          <h3 className="font-bold text-lg mb-2">{movie.Title}</h3>
          <p className="text-gray-600">{movie.Year}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;