import React from 'react';
import { Clock, X } from 'lucide-react';

const SearchHistory = ({ history, onHistoryItemClick, onClear }) => {
  if (!history.length) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Recent Searches</h3>
        {onClear && (
          <button onClick={onClear} className="text-gray-500 hover:text-red-500">
            <X size={16} />
          </button>
        )}
      </div>
      <div className="space-y-2">
        {history.map((item, index) => (
          <button
            key={index}
            onClick={() => onHistoryItemClick(item.query)}
            className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded text-left"
          >
            <Clock size={16} className="text-gray-400" />
            <span>{item.query}</span>
            <span className="text-gray-400 text-sm ml-auto">{item.totalResults} results</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;