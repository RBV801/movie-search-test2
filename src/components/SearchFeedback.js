import React from 'react';

const SearchFeedback = ({ totalResults, currentPage, resultsPerPage = 10, onFeedbackSubmit }) => {
  const startIndex = ((currentPage - 1) * resultsPerPage) + 1;
  const endIndex = Math.min(startIndex + resultsPerPage - 1, totalResults);

  return (
    <div className="search-feedback">
      <div className="results-info">
        {totalResults > 0 ? (
          <>
            <span className="results-count">Found {totalResults} results</span>
            <span className="results-range">Showing {startIndex}-{endIndex}</span>
          </>
        ) : (
          <div className="no-results">No results found. Try adjusting your search terms.</div>
        )}
      </div>
    </div>
  );
};

export default SearchFeedback;