// Error types and handling utilities
export const ErrorTypes = {
  NETWORK: 'NETWORK',
  API: 'API',
  VALIDATION: 'VALIDATION',
  UNKNOWN: 'UNKNOWN',
};

export class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, originalError = null) {
    super(message);
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date();
  }

  static fromApiError(error) {
    return new AppError(
      error.message || 'An error occurred while fetching data',
      ErrorTypes.API,
      error
    );
  }

  static fromNetworkError(error) {
    return new AppError(
      'Unable to connect to the server. Please check your internet connection.',
      ErrorTypes.NETWORK,
      error
    );
  }

  getUserMessage() {
    switch (this.type) {
      case ErrorTypes.NETWORK:
        return 'Connection error. Please check your internet connection and try again.';
      case ErrorTypes.API:
        return this.message || 'An error occurred while fetching movie data. Please try again.';
      case ErrorTypes.VALIDATION:
        return this.message || 'Please check your input and try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  logError() {
    console.error(`[${this.type}] ${this.timestamp.toISOString()}:`, {
      message: this.message,
      originalError: this.originalError,
      stack: this.stack,
    });
  }
}

export const handleApiResponse = async (response) => {
  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
    } catch {
      errorMessage = `HTTP error! status: ${response.status}`;
    }
    throw new AppError(errorMessage, ErrorTypes.API);
  }
  return response;
};

export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries - 1) break;

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};
