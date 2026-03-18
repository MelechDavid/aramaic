import React from 'react';
import { useFavoritesContext } from '../../context/FavoritesContext';

const FavoritesList = () => {
  const { favorites, removeFavorite } = useFavoritesContext();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <p className="font-medium">No favorites yet</p>
        <p className="text-sm mt-1">Tap the heart icon on any entry to save it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-2">
      {favorites.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
        >
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {entry.headwords.join(', ')}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {entry.englishTerms.slice(0, 3).map((term, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full text-xs"
                >
                  {term}
                </span>
              ))}
              {entry.englishTerms.length > 3 && (
                <span className="px-2 py-0.5 text-gray-400 dark:text-gray-500 text-xs">
                  +{entry.englishTerms.length - 3} more
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => removeFavorite(entry.id)}
            aria-label="Remove from favorites"
            className="ml-3 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default FavoritesList;
