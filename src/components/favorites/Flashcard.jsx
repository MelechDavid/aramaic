import React from 'react';

const Flashcard = ({ entry, isFlipped }) => {
  return (
    <div
      className="relative w-full select-none"
      style={{ height: '260px', perspective: '1000px' }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transition: 'transform 0.5s ease',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front — Aramaic */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <p className="text-xs font-semibold text-pink-600 uppercase tracking-widest mb-6">Aramaic</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white text-center leading-snug">
            {entry.headwords.join(' / ')}
          </p>
        </div>

        {/* Back — English */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-pink-50 dark:bg-pink-950 rounded-2xl shadow-lg p-8 border border-pink-200 dark:border-pink-800"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="text-xs font-semibold text-pink-600 uppercase tracking-widest mb-6">English</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white text-center leading-snug">
            {entry.englishTerms.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
