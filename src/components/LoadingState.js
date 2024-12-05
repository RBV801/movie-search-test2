import React from 'react';
import { Loader } from 'lucide-react';

const LoadingState = () => (
  <div className="flex items-center justify-center p-4">
    <Loader className="animate-spin text-blue-500" size={24} />
    <span className="ml-2">Loading results...</span>
  </div>
);

export default LoadingState;