import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalResults, hasMore, onPageChange }) => {
  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;