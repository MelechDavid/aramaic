const Favorite = require('../../_shared/Favorite');
const cors = require('../../_shared/cors');
const { initializeOnce } = require('../../_shared/init');
const { authenticateToken } = require('../../_shared/auth');

module.exports = async (req, res) => {
  // Initialize database
  await initializeOnce();
  
  // Handle CORS
  cors(req, res);
  
  // Only allow DELETE method
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = await authenticateToken(req);
    const { id } = req.query;
      if (!id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }

    const deletedFavorite = await Favorite.deleteById(user.id, id);
    
    if (!deletedFavorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({
      message: 'Favorite removed',
      favorite: deletedFavorite
    });
  } catch (error) {
    console.error('Remove favorite by ID error:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};
