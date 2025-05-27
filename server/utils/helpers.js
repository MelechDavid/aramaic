const crypto = require('crypto');

// Generate a secure random string
const generateSecureRandom = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/\s+/g, ' ');
};

// Format response data
const formatResponse = (success, message, data = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return response;
};

// Validate environment variables
const validateEnvVars = () => {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Parse pagination parameters
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
};

module.exports = {
  generateSecureRandom,
  sanitizeInput,
  formatResponse,
  validateEnvVars,
  parsePagination
};
