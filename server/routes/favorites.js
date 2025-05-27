const express = require('express');
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth');
const { validateFavorite } = require('../middleware/validation');

const router = express.Router();

// Get all favorites for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let favorites;
    if (search) {
      favorites = await Favorite.search(req.user.id, search, parseInt(limit));
    } else {
      favorites = await Favorite.findByUserId(req.user.id, parseInt(limit), offset);
    }

    const totalCount = await Favorite.count(req.user.id);
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
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add word to favorites
router.post('/', auth, validateFavorite, async (req, res) => {
  try {
    const { word, definition, pronunciation } = req.body;

    // Check if already favorited
    const existingFavorite = await Favorite.findByUserIdAndWord(req.user.id, word);
    if (existingFavorite) {
      return res.status(400).json({ message: 'Word already in favorites' });
    }

    const favorite = await Favorite.create({
      userId: req.user.id,
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
    if (error.message === 'Word already in favorites') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove word from favorites
router.delete('/:word', auth, async (req, res) => {
  try {
    const { word } = req.params;
    
    const deletedFavorite = await Favorite.delete(req.user.id, word);
    
    if (!deletedFavorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({
      message: 'Word removed from favorites',
      favorite: deletedFavorite
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove favorite by ID
router.delete('/id/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedFavorite = await Favorite.deleteById(id, req.user.id);
    
    if (!deletedFavorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({
      message: 'Favorite removed',
      favorite: deletedFavorite
    });
  } catch (error) {
    console.error('Remove favorite by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Check if word is favorited
router.get('/check/:word', auth, async (req, res) => {
  try {
    const { word } = req.params;
    
    const favorite = await Favorite.findByUserIdAndWord(req.user.id, word);
    
    res.json({
      isFavorited: !!favorite,
      favorite: favorite || null
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
