// Shared initialization for Vercel serverless functions
require('dotenv').config();
const { createTables } = require('../../server/config/init');
const { validateEnvVars } = require('../../server/utils/helpers');

let initialized = false;

const initializeOnce = async () => {
  if (initialized) return;
  
  try {
    validateEnvVars();
    await createTables();
    initialized = true;
    console.log('✅ Serverless function initialized');
  } catch (error) {
    console.error('❌ Serverless function initialization failed:', error.message);
    // Don't throw in production to allow the function to continue
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
};

module.exports = { initializeOnce };
