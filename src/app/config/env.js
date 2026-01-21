/**
 * Environment Configuration
 * Centralized access to environment variables
 */

export const ENV = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  
  // App Info
  APP_NAME: import.meta.env.VITE_APP_NAME || 'HRIS CMLABS',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // OAuth
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  
  // Feature Flags
  ENABLE_MOCK: import.meta.env.VITE_ENABLE_MOCK === 'true',
  
  // Environment
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
};

// Debug: Log environment in development
if (ENV.IS_DEV) {
  console.log('🔧 Environment Config:', {
    API_URL: ENV.API_URL,
    APP_NAME: ENV.APP_NAME,
    MODE: ENV.MODE,
  });
}

export default ENV;
