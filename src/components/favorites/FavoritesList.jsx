import React, { useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

const FavoritesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { favorites, loading, pagination, searchFavorites, loadMore, removeFavoriteById } = useFavorites();
  const { isAuthenticated } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    searchFavorites(searchTerm);
  };

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to remove this favorite?')) {
      await removeFavoriteById(id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Please log in to view your favorites.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Favorites ({pagination.totalCount || 0})
        </h2>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search favorites..."
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>

      {loading && favorites.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading favorites...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'No favorites found matching your search.' : 'You haven\'t saved any favorites yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {favorite.word}
                    </h3>
                  </div>
                  
                  {favorite.pronunciation && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Pronunciation: {favorite.pronunciation}
                    </p>
                  )}
                  
                  <div 
                    className="text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: favorite.definition }}
                  />
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    Added: {new Date(favorite.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <button
                  onClick={() => handleRemove(favorite.id)}
                  className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  title="Remove from favorites"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          
          {pagination.hasNextPage && (
            <div className="text-center py-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
