// Load environment variables at the top of this file too
require('dotenv').config();

const pool = require('./database');

const createTables = async () => {
  try {
    // Debug logging
    console.log('🔍 Environment Debug:');
    console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO');
    console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    if (process.env.DATABASE_URL) {
      console.log('Database URL starts with:', process.env.DATABASE_URL.substring(0, 20) + '...');
    }
    
    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Favorites table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        word VARCHAR(255) NOT NULL,
        definition TEXT,
        pronunciation VARCHAR(255),
        word_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, word)
      )
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

module.exports = { createTables };
