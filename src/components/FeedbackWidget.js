import React, { useState } from 'react';

const FeedbackWidget = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
      <h3 className="font-semibold mb-2">How was your search experience?</h3>
      <div className="mb-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => setRating(value)}
            className={`mr-1 p-1 ${rating === value ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          >
            {value}
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Any additional feedback?"
        className="w-full p-2 border rounded mb-2"
        rows="2"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
};

export default FeedbackWidget;