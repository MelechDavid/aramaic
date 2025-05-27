const Favorite = require('../../server/models/Favorite');
const cors = require('../_shared/cors');
const { initializeOnce } = require('../_shared/init');
const { authenticateToken } = require('../_shared/auth');

module.exports = async (req, res) => {
  // Initialize database
  await initializeOnce();
  
  // Handle CORS
  cors(req, res);
  
  try {
    const user = await authenticateToken(req);
    
    if (req.method === 'GET') {
      // Get favorites list
      const { page = 1, limit = 20, search } = req.query;
      const offset = (page - 1) * limit;

      let favorites;
      if (search) {
        favorites = await Favorite.search(user.id, search, parseInt(limit));
      } else {
        favorites = await Favorite.findByUserId(user.id, parseInt(limit), offset);
      }

      const totalCount = await Favorite.count(user.id);
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        favorites,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } else if (req.method === 'POST') {
      // Add favorite
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
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Favorites error:', error);
    
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
