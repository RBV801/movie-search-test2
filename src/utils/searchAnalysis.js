export const analyzeSearchIntent = (query) => {
  const factors = [];
  const operations = [];

  // Basic intent analysis
  operations.push('Analyzing search intent and context');

  // Check for actor/director searches
  if (query.toLowerCase().includes('with') || query.toLowerCase().includes('starring')) {
    factors.push('Cast member relevance');
    operations.push('Scanning cast and crew information');
  }

  // Check for genre-related terms
  const genres = ['action', 'comedy', 'drama', 'horror', 'sci-fi', 'thriller'];
  genres.forEach(genre => {
    if (query.toLowerCase().includes(genre)) {
      factors.push(`Genre match: ${genre.charAt(0).toUpperCase() + genre.slice(1)}`);
      operations.push('Applying genre-specific filtering');
    }
  });

  // Check for time period references
  if (query.match(/\d{4}/) || query.includes('recent') || query.includes('latest')) {
    factors.push('Release date relevance');
    operations.push('Analyzing temporal context');
  }

  // Check for quality indicators
  if (query.includes('best') || query.includes('top') || query.includes('popular')) {
    factors.push('Rating and popularity metrics');
    operations.push('Sorting by rating and popularity');
  }

  // Add base operations
  operations.push('Generating personalized ranking');

  // Calculate AI credits used based on complexity
  const creditsUsed = 1 + Math.floor(operations.length / 3);

  return {
    matchFactors: factors,
    aiUsage: {
      creditsUsed,
      operations: [...new Set(operations)] // Remove duplicates
    }
  };
};
