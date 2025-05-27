// API configuration for different environments
const getApiUrl = () => {  // Check if we're in development mode
  if (import.meta.env.DEV) {
    console.log('🔧 Development mode detected, using localhost:5001');
    return 'http://localhost:5001';
  }
  
  // In production, use the same domain but with /api prefix
  console.log('🚀 Production mode detected, using current origin:', window.location.origin);
  return window.location.origin;
};

export const API_BASE_URL = getApiUrl();
console.log('🌐 API_BASE_URL set to:', API_BASE_URL);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    VERIFY: `${API_BASE_URL}/api/auth/verify`,
  },
  FAVORITES: {
    GET: `${API_BASE_URL}/api/favorites`,
    ADD: `${API_BASE_URL}/api/favorites`,
    REMOVE: (id) => `${API_BASE_URL}/api/favorites/${id}`,
  }
};

console.log('📋 API_ENDPOINTS configured:', API_ENDPOINTS);