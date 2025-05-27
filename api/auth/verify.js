const jwt = require('jsonwebtoken');
const User = require('../../server/models/User');
const cors = require('../_shared/cors');
const { initializeOnce } = require('../_shared/init');

// Auth middleware function
const authenticateToken = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = async (req, res) => {
  // Initialize database
  await initializeOnce();
  
  // Handle CORS
  cors(req, res);
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = await authenticateToken(req);
    
    res.json({ 
      valid: true, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ message: 'Unauthorized', valid: false });
    }
    
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found', valid: false });
    }
    
    res.status(500).json({ message: 'Internal server error', valid: false });
  }
};
