import React, { createContext, useContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const FavoritesContext = createContext();

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesContextProvider');
  }
  return context;
};

const MAX_RECENT = 10;

export const FavoritesContextProvider = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage('aramaic-favorites', []);
  const [recentEntries, setRecentEntries] = useLocalStorage('aramaic-recent', []);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const isFavorite = (id) => Array.isArray(favorites) && favorites.some(f => f.id === id);

  const toggleFavorite = (entry) => {
    const slim = { id: entry.id, headwords: entry.headwords, englishTerms: entry.englishTerms };
    setFavorites(prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (list.some(f => f.id === entry.id)) {
        return list.filter(f => f.id !== entry.id);
      }
      return [...list, slim];
    });
  };

  const removeFavorite = (id) => {
    setFavorites(prev => {
      const list = Array.isArray(prev) ? prev : [];
      return list.filter(f => f.id !== id);
    });
  };

  const addRecentEntry = (entry) => {
    const slim = { id: entry.id, headwords: entry.headwords, englishTerms: entry.englishTerms };
    setRecentEntries(prev => {
      const list = Array.isArray(prev) ? prev : [];
      const filtered = list.filter(e => e.id !== entry.id);
      return [slim, ...filtered].slice(0, MAX_RECENT);
    });
  };

  const openFavorites = () => setIsFavoritesOpen(true);
  const closeFavorites = () => setIsFavoritesOpen(false);

  const favoritesArray = Array.isArray(favorites) ? favorites : [];
  const recentArray = Array.isArray(recentEntries) ? recentEntries : [];

  return (
    <FavoritesContext.Provider value={{
      favorites: favoritesArray,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      recentEntries: recentArray,
      addRecentEntry,
      isFavoritesOpen,
      openFavorites,
      closeFavorites,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContextProvider;
