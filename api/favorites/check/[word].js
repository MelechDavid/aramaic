const Favorite = require('../../../server/models/Favorite');
const cors = require('../../_shared/cors');
const { initializeOnce } = require('../../_shared/init');
const { authenticateToken } = require('../../_shared/auth');

module.exports = async (req, res) => {
  // Initialize database
  await initializeOnce();
  
  // Handle CORS
  cors(req, res);
  
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = await authenticateToken(req);
    const { word } = req.query;
    
    if (!word) {
      return res.status(400).json({ message: 'Word parameter is required' });
    }

    const favorite = await Favorite.findByUserIdAndWord(user.id, word);
    
    res.json({
      isFavorited: !!favorite,
      favorite: favorite || null
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};
