// API configuration for different environments
const getApiUrl = () => {
  // More detailed environment detection
  const isDev = import.meta.env.DEV;
  const mode = import.meta.env.MODE;
  const nodeEnv = import.meta.env.NODE_ENV;
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'unknown';
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
  
  console.log('🔍 Environment Detection:', {
    isDev,
    mode,
    nodeEnv,
    currentOrigin,
    hostname,
    importMeta: import.meta.env
  });
  
  // FORCE production mode if we're NOT on localhost
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  // Only use localhost in development AND when actually on localhost
  if (isDev && isLocalhost) {
    console.log('🔧 Development mode detected on localhost, using localhost:5001');
    return 'http://localhost:5001';
  }
  
  // For everything else (production, Vercel, etc.), use current origin
  console.log('🚀 Production mode or remote domain detected, using current origin:', currentOrigin);
  console.warn('🚨 If you see localhost:5000 errors, there may be cached code or another API configuration!');
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
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
  },
  FAVORITES: {
    GET: `${API_BASE_URL}/api/favorites?action=list`,
    ADD: `${API_BASE_URL}/api/favorites?action=add`,
    REMOVE: (id) => `${API_BASE_URL}/api/favorites?action=delete&id=${id}`,
    REMOVE_BY_WORD: (word) => `${API_BASE_URL}/api/favorites?action=delete&word=${encodeURIComponent(word)}`,
    CHECK: (word) => `${API_BASE_URL}/api/favorites?action=check&word=${encodeURIComponent(word)}`,
  }
};

console.log('📋 API_ENDPOINTS configured:', API_ENDPOINTS);