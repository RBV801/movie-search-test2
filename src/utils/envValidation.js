// Environment variable validation
const requiredEnvVars = {
  REACT_APP_API_URL: 'API URL for movie search backend',
};

export const validateEnv = () => {
  const missingVars = [];

  Object.entries(requiredEnvVars).forEach(([key, description]) => {
    if (!process.env[key]) {
      missingVars.push({ key, description });
    }
  });

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:');
    missingVars.forEach(({ key, description }) => {
      console.error(`- ${key}: ${description}`);
    });
    return false;
  }

  return true;
};

export const getApiUrl = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  if (!apiUrl) {
    throw new Error('API URL environment variable is not configured');
  }
  return apiUrl.replace(/\/+$/, ''); // Remove trailing slashes
};
