import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const { isAuthenticated } = useAuth();

  // Load favorites when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
      setPagination({});
    }
  }, [isAuthenticated]);

  const loadFavorites = async (page = 1, search = '') => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      
      const response = await axios.get('/api/favorites', { params });
      const { favorites: newFavorites, pagination: newPagination } = response.data;
      
      if (page === 1) {
        setFavorites(newFavorites);
      } else {
        setFavorites(prev => [...prev, ...newFavorites]);
      }
      setPagination(newPagination);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (word, definition, pronunciation = null) => {
    if (!isAuthenticated) return { success: false, error: 'Please log in to add favorites' };
    
    try {
      const response = await axios.post('/api/favorites', {
        word,
        definition,
        pronunciation
      });
      
      const newFavorite = response.data.favorite;
      setFavorites(prev => [newFavorite, ...prev]);
      
      return { success: true, favorite: newFavorite };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to favorites';
      return { success: false, error: message };
    }
  };

  const removeFromFavorites = async (word) => {
    if (!isAuthenticated) return { success: false, error: 'Please log in' };
    
    try {
      await axios.delete(`/api/favorites/${encodeURIComponent(word)}`);
      setFavorites(prev => prev.filter(fav => fav.word !== word));
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from favorites';
      return { success: false, error: message };
    }
  };

  const removeFavoriteById = async (id) => {
    if (!isAuthenticated) return { success: false, error: 'Please log in' };
    
    try {
      await axios.delete(`/api/favorites/id/${id}`);
      setFavorites(prev => prev.filter(fav => fav.id !== id));
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove favorite';
      return { success: false, error: message };
    }
  };

  const checkIsFavorited = async (word) => {
    if (!isAuthenticated) return false;
    
    try {
      const response = await axios.get(`/api/favorites/check/${encodeURIComponent(word)}`);
      return response.data.isFavorited;
    } catch (error) {
      console.error('Failed to check favorite status:', error);
      return false;
    }
  };

  const searchFavorites = async (searchTerm) => {
    setLoading(true);
    try {
      await loadFavorites(1, searchTerm);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (pagination.hasNextPage && !loading) {
      await loadFavorites(pagination.currentPage + 1);
    }
  };

  const value = {
    favorites,
    loading,
    pagination,
    addToFavorites,
    removeFromFavorites,
    removeFavoriteById,
    checkIsFavorited,
    searchFavorites,
    loadFavorites,
    loadMore
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
