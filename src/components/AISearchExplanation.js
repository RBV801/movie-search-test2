import React from 'react';
import { Brain, ArrowUpRight, Scale, Star } from 'lucide-react';

const AISearchExplanation = ({
  searchTerm = '',
  resultCount = 0,
  matchFactors = [],
  aiUsage = {
    creditsUsed: 0,
    operations: []
  }
}) => {
  if (!searchTerm || resultCount === 0) return null;

  return (
    <div className="w-full bg-gray-900 rounded-lg p-6 space-y-6 text-gray-100 mb-6">
      <div className="flex items-start gap-4">
        <Brain className="text-purple-400 mt-1" size={24} />
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">Search Analysis</h2>
          <p className="text-gray-300">
            Found {resultCount} movies matching "{searchTerm}"
          </p>
        </div>
        <div className="px-3 py-1 bg-purple-900/30 rounded-full flex items-center gap-2">
          <Star size={16} className="text-purple-400" />
          <span className="text-purple-200 text-sm">{aiUsage.creditsUsed} AI credits used</span>
        </div>
      </div>

      {matchFactors.length > 0 && (
        <div className="space-y-4 border-t border-gray-800 pt-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Scale size={18} className="text-blue-400" />
            Key Factors in Results
          </h3>
          <div className="space-y-3">
            {matchFactors.map((factor, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 text-gray-300 bg-gray-800/50 p-3 rounded"
              >
                <ArrowUpRight size={16} className="text-green-400" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {aiUsage.operations.length > 0 && (
        <div className="space-y-2 border-t border-gray-800 pt-4">
          <h3 className="text-lg font-medium">AI Processing Steps</h3>
          <div className="space-y-2 text-sm text-gray-400">
            {aiUsage.operations.map((operation, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                {operation}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AISearchExplanation;