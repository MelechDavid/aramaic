// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { createTables } = require('./config/init');
const { validateEnvVars } = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database on startup
const initializeApp = async () => {
  try {
    console.log('🔍 Validating environment variables...');
    
    // Debug: Log if environment variables are loaded
    console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);
    console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
    
    validateEnvVars();
    
    console.log('🗄️  Initializing database...');
    await createTables();
    
    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
    // Don't exit in production, continue with app startup
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-vercel-app.vercel.app'] 
    : function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // Allow any localhost or 127.0.0.1 on common dev ports
        const devOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1):(3000|4000|5000|5173|5174|5175|8080|8000)$/;
        
        if (devOriginPattern.test(origin)) {
          console.log('✅ CORS allowed origin:', origin);
          return callback(null, true);
        }
        
        // Log rejected origins for debugging
        console.log('❌ CORS rejected origin:', origin);
        return callback(new Error('Not allowed by CORS'));
      },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/favorites', require('./routes/favorites'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeApp();
});
