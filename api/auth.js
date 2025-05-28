// Consolidated authentication endpoints to reduce function count
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const init = require('./_shared/init');
const User = require('./_shared/User');
const { authenticateToken } = require('./_shared/auth');

module.exports = async (req, res) => {
  await init(req, res);
  
  const { method } = req;
  const pathSegments = req.url.split('/').filter(Boolean);
  const action = pathSegments[pathSegments.length - 1]; // last segment after /api/auth/
  
  switch (method) {
    case 'POST':
      if (action === 'register') {
        return handleRegister(req, res);
      } else if (action === 'login') {
        return handleLogin(req, res);
      } else if (action === 'verify') {
        return handleVerify(req, res);
      }
      break;
    case 'GET':
      if (action === 'profile') {
        return handleProfile(req, res);
      }
      break;
  }
  
  return res.status(404).json({ error: 'Endpoint not found' });
};

async function handleRegister(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = await User.create(email, hashedPassword);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
}

async function handleVerify(req, res) {
  try {
    const authResult = await authenticateToken(req, res);
    if (!authResult.success) {
      return; // Response already sent by authenticateToken
    }
    
    const { userId } = authResult.user;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'Token is valid',
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Internal server error during token verification' });
  }
}

async function handleProfile(req, res) {
  try {
    const authResult = await authenticateToken(req, res);
    if (!authResult.success) {
      return; // Response already sent by authenticateToken
    }
    
    const { userId } = authResult.user;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error fetching profile' });
  }
}
