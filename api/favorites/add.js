const Favorite = require('../../server/models/Favorite');
const cors = require('../_shared/cors');
const { initializeOnce } = require('../_shared/init');
const { authenticateToken } = require('../_shared/auth');

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
    const { word, definition, pronunciation } = req.body;

    // Basic validation
    if (!word || !definition) {
      return res.status(400).json({ message: 'Word and definition are required' });
    }

    if (word.trim().length < 1 || word.trim().length > 100) {
      return res.status(400).json({ message: 'Word must be between 1 and 100 characters' });
    }

    if (definition.trim().length < 1 || definition.trim().length > 1000) {
      return res.status(400).json({ message: 'Definition must be between 1 and 1000 characters' });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findByUserIdAndWord(user.id, word);
    if (existingFavorite) {
      return res.status(400).json({ message: 'Word already in favorites' });
    }

    const favorite = await Favorite.create({
      userId: user.id,
      word,
      definition,
      pronunciation
    });

    res.status(201).json({
      message: 'Word added to favorites',
      favorite
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (error.message === 'Word already in favorites') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};
