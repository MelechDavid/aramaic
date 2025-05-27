import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_ENDPOINTS } from '../config/api';

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
  const [pagination, setPagination] = useState({ totalCount: 0, hasNextPage: false });
  const { user, token } = useAuth();  // Fetch favorites when user logs in and token is available
  useEffect(() => {
    if (user && token) {
      // Small delay to ensure axios headers are set and token is validated
      const timer = setTimeout(() => {
        fetchFavorites();
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setFavorites([]);
      setPagination({ totalCount: 0, hasNextPage: false });
    }
  }, [user, token]);const fetchFavorites = async () => {
    if (!user || !token) return;
    
    try {
      setLoading(true);
      console.log('Fetching favorites from:', API_ENDPOINTS.FAVORITES.GET);
      
      // Ensure the token is in the authorization header
      const response = await axios.get(API_ENDPOINTS.FAVORITES.GET, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Backend returns { favorites: [], pagination: {} }
      const { favorites: favoritesData, pagination: paginationData } = response.data;
      
      setFavorites(favoritesData || []);
      setPagination(paginationData || { totalCount: 0, hasNextPage: false });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
      setPagination({ totalCount: 0, hasNextPage: false });
    } finally {
      setLoading(false);
    }
  };
  const addFavorite = async (word, definition, pronunciation = '', wordData = {}) => {
    if (!user || !token) return { success: false, message: 'Please log in to add favorites' };

    try {
      console.log('Adding favorite to:', API_ENDPOINTS.FAVORITES.ADD);
      const response = await axios.post(API_ENDPOINTS.FAVORITES.ADD, {
        word,
        definition,
        pronunciation,
        word_data: wordData,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setFavorites(prev => [...prev, response.data]);
      setPagination(prev => ({ 
        ...prev, 
        totalCount: prev.totalCount + 1 
      }));
      return { success: true };
    } catch (error) {
      console.error('Error adding favorite:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add favorite' 
      };
    }
  };

  const removeFavorite = async (favoriteId) => {
    if (!user || !token) return { success: false, message: 'Please log in to remove favorites' };

    try {
      console.log('Removing favorite from:', API_ENDPOINTS.FAVORITES.REMOVE(favoriteId));
      await axios.delete(API_ENDPOINTS.FAVORITES.REMOVE(favoriteId), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      setPagination(prev => ({ 
        ...prev, 
        totalCount: Math.max(0, prev.totalCount - 1) 
      }));
      return { success: true };
    } catch (error) {
      console.error('Error removing favorite:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove favorite' 
      };
    }
  };

  const isFavorite = (word) => {
    return favorites.some(fav => fav.word === word);
  };

  const getFavoriteByWord = (word) => {
    return favorites.find(fav => fav.word === word);
  };
  const searchFavorites = async (searchTerm) => {
    if (!user || !token) return;
    
    try {
      setLoading(true);
      console.log('Searching favorites with term:', searchTerm);
      
      const response = await axios.get(`${API_ENDPOINTS.FAVORITES.GET}?search=${encodeURIComponent(searchTerm)}`, {        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Backend returns { favorites: [], pagination: {} }
      const { favorites: favoritesData, pagination: paginationData } = response.data;
      
      setFavorites(favoritesData || []);
      setPagination(paginationData || { totalCount: 0, hasNextPage: false });
    } catch (error) {
      console.error('Error searching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    // Placeholder for pagination - currently not implemented in backend
    console.log('Load more favorites (not implemented yet)');
  };

  const removeFavoriteById = async (favoriteId) => {
    return await removeFavorite(favoriteId);
  };

  const value = {
    favorites,
    loading,
    pagination,
    addFavorite,
    removeFavorite,
    removeFavoriteById,
    isFavorite,
    getFavoriteByWord,
    fetchFavorites,
    searchFavorites,
    loadMore,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
