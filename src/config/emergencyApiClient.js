// Emergency API client with forced correct URL
import axios from 'axios';
import { API_BASE_URL } from './api.js';

// Create a new axios instance that ignores any global defaults
const apiClient = axios.create({
  baseURL: undefined, // Explicitly no baseURL
  timeout: 10000,
});

// Add request interceptor to ensure URLs are always correct
apiClient.interceptors.request.use(
  (config) => {
    // If URL doesn't start with http, prepend our API_BASE_URL
    if (config.url && !config.url.startsWith('http')) {
      config.url = `${API_BASE_URL}${config.url.startsWith('/') ? '' : '/'}${config.url}`;
    }
    
    console.log('🛡️ Emergency API Client Request:', {
      originalUrl: config.url,
      finalUrl: config.url,
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL
    });
    
    return config;
  },
  (error) => {
    console.error('🚨 Emergency API Client Request Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
