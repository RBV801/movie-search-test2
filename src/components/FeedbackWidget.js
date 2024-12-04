import React, { useState } from 'react';

const FeedbackWidget = ({ onSubmit, searchQuery }) => {
  const [showThankYou, setShowThankYou] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const handleFeedback = (rating) => {
    setSelectedRating(rating);
    onSubmit({
      query: searchQuery,
      rating,
      timestamp: new Date().toISOString()
    });
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      setSelectedRating(null);
    }, 2000);
  };

  if (showThankYou) {
    return (
      <div className="feedback-widget thank-you">
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className="feedback-widget">
      <p>How relevant were these results?</p>
      <div className="feedback-buttons">
        <button
          onClick={() => handleFeedback('poor')}
          className={`feedback-button poor ${selectedRating === 'poor' ? 'selected' : ''}`}
          aria-label="Poor results"
        >
          😕
        </button>
        <button
          onClick={() => handleFeedback('okay')}
          className={`feedback-button okay ${selectedRating === 'okay' ? 'selected' : ''}`}
          aria-label="Okay results"
        >
          😐
        </button>
        <button
          onClick={() => handleFeedback('good')}
          className={`feedback-button good ${selectedRating === 'good' ? 'selected' : ''}`}
          aria-label="Good results"
        >
          😊
        </button>
      </div>
    </div>
  );
};

export default FeedbackWidget;