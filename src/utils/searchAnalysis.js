export const analyzeSearchIntent = (query) => {
  const factors = [];
  const operations = [];
  const genreKeywords = ['action', 'comedy', 'drama', 'horror', 'thriller', 'sci-fi'];
  const timeKeywords = ['latest', 'recent', 'new', 'old', 'classic'];

  operations.push('Analyzing search intent');

  // Actor detection
  if (query.toLowerCase().includes('with') || query.toLowerCase().includes('starring')) {
    factors.push('Cast member relevance');
    operations.push('Actor name detection');
  }

  // Genre detection
  genreKeywords.forEach(genre => {
    if (query.toLowerCase().includes(genre)) {
      factors.push(`Genre: ${genre}`);
      operations.push('Genre analysis');
    }
  });

  // Time period
  timeKeywords.forEach(time => {
    if (query.toLowerCase().includes(time)) {
      factors.push('Release date relevance');
      operations.push('Temporal analysis');
    }
  });

  return {
    matchFactors: factors,
    aiUsage: {
      creditsUsed: Math.max(1, Math.floor(operations.length / 2)),
      operations: [...new Set(operations)]
    }
  };
};