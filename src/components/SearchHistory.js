import React from 'react';

const SearchHistory = ({ history, onHistoryItemClick, onClearHistory }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="search-history">
      <div className="search-history-header">
        <h3>Recent Searches</h3>
        <button 
          onClick={onClearHistory}
          className="clear-history-button"
          title="Clear search history"
        >
          Clear History
        </button>
      </div>
      <div className="search-history-list">
        {history.map((item, index) => (
          <button
            key={`${item.query}-${index}`}
            className="history-item"
            onClick={() => onHistoryItemClick(item)}
            title={`Search again for: ${item.query}`}
          >
            <span className="history-query">{item.query}</span>
            <span className="history-time">{new Date(item.timestamp).toLocaleTimeString()}</span>
            <span className="history-results">{item.totalResults} results</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
