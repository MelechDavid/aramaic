// Consolidated favorites endpoints to reduce function count
const init = require('./_shared/init');
const Favorite = require('./_shared/Favorite');
const { authenticateToken } = require('./_shared/auth');

module.exports = async (req, res) => {
  await init(req, res);
  
  const { method, query } = req;
  const pathSegments = req.url.split('/').filter(Boolean);
  
  // Parse the URL to determine the action
  // Examples:
  // /api/favorites -> list all favorites
  // /api/favorites?action=add -> add favorite
  // /api/favorites?action=check&word=hello -> check if word is favorited
  // /api/favorites?action=delete&id=123 -> delete by ID
  // /api/favorites?action=delete&word=hello -> delete by word
  
  const action = query.action || 'list';
  
  // All favorites endpoints require authentication
  const authResult = await authenticateToken(req, res);
  if (!authResult.success) {
    return; // Response already sent by authenticateToken
  }
  
  const { userId } = authResult.user;
  
  switch (method) {
    case 'GET':
      if (action === 'list') {
        return handleList(req, res, userId);
      } else if (action === 'check') {
        return handleCheck(req, res, userId, query.word);
      }
      break;
    case 'POST':
      if (action === 'add') {
        return handleAdd(req, res, userId);
      }
      break;
    case 'DELETE':
      if (action === 'delete') {
        if (query.id) {
          return handleDeleteById(req, res, userId, query.id);
        } else if (query.word) {
          return handleDeleteByWord(req, res, userId, query.word);
        }
      }
      break;
  }
  
  return res.status(404).json({ error: 'Endpoint not found' });
};

async function handleList(req, res, userId) {
  try {
    const favorites = await Favorite.findByUserId(userId);
    res.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Internal server error fetching favorites' });
  }
}

async function handleCheck(req, res, userId, word) {
  try {
    if (!word) {
      return res.status(400).json({ error: 'Word parameter is required' });
    }
    
    const favorite = await Favorite.findByUserIdAndWord(userId, word);
    res.json({ 
      isFavorited: !!favorite,
      favorite: favorite || null
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ error: 'Internal server error checking favorite' });
  }
}

async function handleAdd(req, res, userId) {
  try {
    const { word, definition, pronunciation } = req.body;
    
    if (!word || !definition) {
      return res.status(400).json({ 
        error: 'Word and definition are required' 
      });
    }
    
    // Check if already favorited
    const existingFavorite = await Favorite.findByUserIdAndWord(userId, word);
    if (existingFavorite) {
      return res.status(400).json({ 
        error: 'Word is already in favorites' 
      });
    }
    
    const favorite = await Favorite.create(userId, word, definition, pronunciation);
    res.status(201).json({
      message: 'Word added to favorites',
      favorite
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Internal server error adding favorite' });
  }
}

async function handleDeleteById(req, res, userId, id) {
  try {
    const deleted = await Favorite.deleteById(userId, id);
    if (deleted) {
      res.json({ message: 'Favorite removed successfully' });
    } else {
      res.status(404).json({ error: 'Favorite not found' });
    }
  } catch (error) {
    console.error('Error deleting favorite by ID:', error);
    res.status(500).json({ error: 'Internal server error deleting favorite' });
  }
}

async function handleDeleteByWord(req, res, userId, word) {
  try {
    const deleted = await Favorite.deleteByUserIdAndWord(userId, word);
    if (deleted) {
      res.json({ message: 'Favorite removed successfully' });
    } else {
      res.status(404).json({ error: 'Favorite not found' });
    }
  } catch (error) {
    console.error('Error deleting favorite by word:', error);
    res.status(500).json({ error: 'Internal server error deleting favorite' });
  }
}
