import React, { useState } from 'react';
import Flashcard from './Flashcard';
import { useFavoritesContext } from '../../context/FavoritesContext';

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const FlashcardView = () => {
  const { favorites } = useFavoritesContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(null);

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <p className="font-medium">No favorites yet</p>
        <p className="text-sm mt-1">Save entries to use flashcards.</p>
      </div>
    );
  }

  const cards = shuffled || favorites;
  const entry = cards[Math.min(currentIndex, cards.length - 1)];

  const goTo = (index) => {
    setIsFlipped(false);
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) goTo(currentIndex + 1);
  };

  const handleShuffle = () => {
    setShuffled(shuffleArray(favorites));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleUnshuffle = () => {
    setShuffled(null);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {currentIndex + 1} / {cards.length}
      </p>

      {/* Card — tap to flip */}
      <div className="w-full cursor-pointer" onClick={() => setIsFlipped(f => !f)}>
        <Flashcard entry={entry} isFlipped={isFlipped} />
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500">Tap card to flip</p>

      {/* Navigation controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Previous card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={shuffled ? handleUnshuffle : handleShuffle}
          className="px-5 py-2 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 text-sm font-medium hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors"
        >
          {shuffled ? 'Unshuffle' : 'Shuffle'}
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Next card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FlashcardView;
