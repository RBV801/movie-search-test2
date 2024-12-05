import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      <span className="ml-4 text-gray-900 font-medium">Searching...</span>
    </div>
  );
};

export default LoadingState;
