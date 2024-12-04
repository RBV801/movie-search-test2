import React from 'react';

const SearchFeedback = ({ totalResults, currentPage, resultsPerPage = 10 }) => {
  const startIndex = ((currentPage - 1) * resultsPerPage) + 1;
  const endIndex = Math.min(startIndex + resultsPerPage - 1, totalResults);

  return (
    <div className="search-feedback">
      {totalResults > 0 ? (
        <div className="results-info">
          <span className="results-count">Found {totalResults} results</span>
          <span className="results-range">Showing {startIndex}-{endIndex}</span>
        </div>
      ) : (
        <div className="no-results">No results found. Try adjusting your search terms.</div>
      )}
    </div>
  );
};

export default SearchFeedback;