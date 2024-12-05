import React from 'react';

const AiExplanationPanel = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="bg-gray-100 p-4 rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
      <div className="text-sm">
        <p className="mb-2">{analysis.intent}</p>
        {analysis.suggestions && (
          <div>
            <h4 className="font-semibold mt-2">Suggestions:</h4>
            <ul className="list-disc pl-4">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiExplanationPanel;