import React from 'react';

const SearchFeedback = ({ totalResults, currentPage, resultsPerPage = 10 }) => {
  // Calculate actual number of results being shown
  const startIndex = ((currentPage - 1) * resultsPerPage) + 1;
  const endIndex = Math.min(startIndex + resultsPerPage - 1, totalResults || 0);

  if (!totalResults) return null;

  return (
    <div className="search-feedback">
      <div className="results-info">
        <span className="results-count">Found {totalResults} results</span>
        {totalResults > 0 && (
          <span className="results-range">
            Showing {startIndex}-{endIndex}
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchFeedback;