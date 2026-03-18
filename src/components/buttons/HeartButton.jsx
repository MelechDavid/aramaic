import React from 'react';
import { useFavoritesContext } from '../../context/FavoritesContext';

const HeartButton = ({ entry, className = '' }) => {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const favorited = isFavorite(entry.id);

  const handleClick = (e) => {
    e.stopPropagation();
    toggleFavorite(entry);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 ${
        favorited ? 'text-pink-600' : 'text-gray-400 dark:text-gray-500 hover:text-pink-500'
      } ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};

export default HeartButton;
