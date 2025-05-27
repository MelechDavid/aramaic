// API configuration for different environments
const getApiUrl = () => {
  // More detailed environment detection
  const isDev = import.meta.env.DEV;
  const mode = import.meta.env.MODE;
  const nodeEnv = import.meta.env.NODE_ENV;
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'unknown';
  
  console.log('🔍 Environment Detection:', {
    isDev,
    mode,
    nodeEnv,
    currentOrigin,
    importMeta: import.meta.env
  });
  
  // Force production detection if we're on a .vercel.app domain
  const isVercelDomain = typeof window !== 'undefined' && 
    (window.location.hostname.includes('.vercel.app') || 
     window.location.hostname.includes('.vercel.com'));
  
  // Check if we're in development mode (and not on Vercel)
  if (isDev && !isVercelDomain) {
    console.log('🔧 Development mode detected, using localhost:5001');
    return 'http://localhost:5001';
  }
  
  // In production or on Vercel, use the same domain
  console.log('🚀 Production mode detected, using current origin:', currentOrigin);
  return currentOrigin;
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
    REMOVE: (id) => `${API_BASE_URL}/api/favorites/id/${id}`,
    REMOVE_BY_WORD: (word) => `${API_BASE_URL}/api/favorites/${encodeURIComponent(word)}`,
  }
};

console.log('📋 API_ENDPOINTS configured:', API_ENDPOINTS);