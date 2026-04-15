import React, { useEffect, useState } from 'react';
import { useFavoritesContext } from '../../context/FavoritesContext';
import FavoritesList from './FavoritesList';
import FlashcardView from './FlashcardView';
import FavoritesQuiz from './FavoritesQuiz';

const TABS = ['List', 'Flashcards', 'Quiz'];

const FavoritesModal = () => {
  const { isFavoritesOpen, closeFavorites } = useFavoritesContext();
  const [activeTab, setActiveTab] = useState('List');

  useEffect(() => {
    if (isFavoritesOpen) {
      document.body.classList.add('favorites-modal-open');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.classList.remove('favorites-modal-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.classList.remove('favorites-modal-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isFavoritesOpen]);

  const slideClass = isFavoritesOpen ? 'translate-x-0' : 'translate-x-full';

  if (!isFavoritesOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${slideClass}`}
      style={{ willChange: 'transform' }}
    >
      {/* Sticky header */}
      <div className="sticky top-0 left-0 z-[51] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={closeFavorites}
            className="p-2 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all hover:scale-110 flex-shrink-0"
            aria-label="Back to dictionary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Favorites</h2>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 px-4 pb-3">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-3xl mx-auto pb-16">
        {activeTab === 'List' && <FavoritesList />}
        {activeTab === 'Flashcards' && <FlashcardView />}
        {activeTab === 'Quiz' && <FavoritesQuiz />}
      </div>
    </div>
  );
};

export default FavoritesModal;
