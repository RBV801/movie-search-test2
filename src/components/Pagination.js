import React from 'react';

const Pagination = ({ currentPage, totalResults, hasMore, onPageChange }) => {
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <div className="flex justify-center my-6">
      {currentPage > 1 && (
        <button
          className="px-4 py-2 mr-2 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
      )}
      {hasMore && (
        <button
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;