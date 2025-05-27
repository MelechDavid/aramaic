import React from "react";
import ReactDOM from "react-dom/client";
import axios from 'axios';

import "./assets/styles/index.css";
import App from "./App.jsx";

// 🚨 EMERGENCY DEBUGGING: Override any potential axios baseURL
console.log('🚨 Emergency Debug - Checking axios defaults:');
console.log('axios.defaults.baseURL:', axios.defaults.baseURL);
console.log('Current origin:', window.location.origin);

// Force clear any baseURL that might be set
if (axios.defaults.baseURL && axios.defaults.baseURL.includes('localhost:5000')) {
  console.warn('🚨 FOUND PROBLEMATIC BASEURL! Clearing it...');
  delete axios.defaults.baseURL;
}

// Add global interceptor to catch ANY localhost:5000 requests
axios.interceptors.request.use(
  (config) => {
    const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    
    // Log all requests
    console.log('🌐 Global Axios Request:', {
      url: config.url,
      baseURL: config.baseURL,
      fullURL: fullUrl,
      method: config.method?.toUpperCase(),
      origin: window.location.origin
    });
    
    // CRITICAL: Block localhost:5000 requests in production
    if (fullUrl.includes('localhost:5000')) {
      console.error('🚨🚨🚨 BLOCKED LOCALHOST:5000 REQUEST!');
      console.error('Request details:', config);
      console.error('Stack trace:', new Error().stack);
      
      // Replace with current origin
      if (config.baseURL === 'http://localhost:5000') {
        config.baseURL = window.location.origin;
        console.log('🔧 Fixed baseURL to:', config.baseURL);
      }
      
      if (config.url.startsWith('http://localhost:5000')) {
        config.url = config.url.replace('http://localhost:5000', window.location.origin);
        console.log('🔧 Fixed URL to:', config.url);
      }
    }
      return config;
  },
  (error) => {
    console.error('🚨 Global Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Also intercept fetch requests
const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
  console.log('🌐 Global Fetch Request:', {
    url,
    method: options.method || 'GET',
    origin: window.location.origin
  });
  
  // Block localhost:5000 fetch requests
  if (typeof url === 'string' && url.includes('localhost:5000')) {
    console.error('🚨🚨🚨 BLOCKED LOCALHOST:5000 FETCH REQUEST!');
    console.error('URL:', url);
    console.error('Stack trace:', new Error().stack);
    
    // Replace with current origin
    url = url.replace('http://localhost:5000', window.location.origin);
    console.log('🔧 Fixed fetch URL to:', url);
  }
  
  return originalFetch.call(this, url, options);
};

// Access element from index.html document.
const element = document.getElementById("root");

// Create a React root using ReactDOM library with the root element.
const root = ReactDOM.createRoot(element);

// Render the React <App /> component into the root with StrictMode enabled.
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
