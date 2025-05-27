import React, { useState, useEffect } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

const FavoriteButton = ({ word, definition, pronunciation }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToFavorites, removeFromFavorites, checkIsFavorited } = useFavorites();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && word) {
      checkFavoriteStatus();
    } else {
      setIsFavorited(false);
    }
  }, [word, isAuthenticated]);

  const checkFavoriteStatus = async () => {
    try {
      const favorited = await checkIsFavorited(word);
      setIsFavorited(favorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save favorites');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        const result = await removeFromFavorites(word);
        if (result.success) {
          setIsFavorited(false);
        } else {
          console.error('Failed to remove favorite:', result.error);
        }
      } else {
        const result = await addToFavorites(word, definition, pronunciation);
        if (result.success) {
          setIsFavorited(true);
        } else {
          console.error('Failed to add favorite:', result.error);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't show favorite button if not logged in
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        isFavorited
          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg 
        className={`w-4 h-4 mr-1 ${isFavorited ? 'fill-current' : 'stroke-current fill-none'}`}
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      {isLoading ? 'Saving...' : (isFavorited ? 'Favorited' : 'Favorite')}
    </button>
  );
};

export default FavoriteButton;
