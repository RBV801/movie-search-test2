const FEEDBACK_KEY = 'movieSearchFeedback';

export const saveFeedback = (feedback) => {
  try {
    const existingFeedback = getFeedbackHistory();
    const newFeedback = [...existingFeedback, feedback];
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(newFeedback));
    return true;
  } catch (error) {
    console.error('Error saving feedback:', error);
    return false;
  }
};

export const getFeedbackHistory = () => {
  try {
    const feedback = localStorage.getItem(FEEDBACK_KEY);
    return feedback ? JSON.parse(feedback) : [];
  } catch (error) {
    console.error('Error loading feedback history:', error);
    return [];
  }
};

// Optional: Add function to clear feedback history if needed
export const clearFeedbackHistory = () => {
  try {
    localStorage.removeItem(FEEDBACK_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing feedback history:', error);
    return false;
  }
};
