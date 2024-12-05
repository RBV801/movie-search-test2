import React from 'react';

const SearchHistory = ({ history, onHistoryItemClick }) => {
  if (!history?.length) return null;

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h3 className="text-lg font-semibold mb-2">Recent Searches</h3>
      <ul>
        {history.map((item, index) => (
          <li
            key={index}
            onClick={() => onHistoryItemClick(item.query)}
            className="cursor-pointer hover:bg-gray-200 p-2 rounded"
          >
            <span className="font-medium">{item.query}</span>
            <span className="text-sm text-gray-600 ml-2">({item.results} results)</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;