import React, { useState, useEffect, useRef } from 'react';
import { useFavoritesContext } from '../../context/FavoritesContext';
import EntryDetails from './EntryDetails';

const RecentEntries = ({ toggleEntry, expandedEntries }) => {
  const { recentEntries } = useFavoritesContext();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [slideAnimation, setSlideAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pendingIdRef = useRef(null);

  // Update entry with full definition when loaded
  useEffect(() => {
    if (isLoading && pendingIdRef.current && expandedEntries[pendingIdRef.current]) {
      setSelectedEntry(prev => ({
        ...prev,
        ...expandedEntries[pendingIdRef.current],
      }));
      setIsLoading(false);
    }
  }, [expandedEntries, isLoading]);

  if (recentEntries.length === 0) return null;

  const handleEntryClick = (entry) => {
    if (isLoading) return;
    setIsLoading(true);
    pendingIdRef.current = entry.id;

    setSelectedEntry({ ...entry, definition: 'Loading...' });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSlideAnimation(true));
    });

    if (!expandedEntries[entry.id]) {
      toggleEntry(entry.id);
    } else {
      setSelectedEntry(prev => ({ ...prev, ...expandedEntries[entry.id] }));
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const handleBack = () => {
    setSlideAnimation(false);
    setTimeout(() => {
      setSelectedEntry(null);
      pendingIdRef.current = null;
      setIsLoading(false);
    }, 300);
  };

  return (
    <>
      <div className="mt-6">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-1">
          Recently Viewed
        </h2>

        {recentEntries.map((entry) => {
          const isPending = isLoading && pendingIdRef.current === entry.id;
          return (
            <div
              key={entry.id}
              className={`mb-4 rounded-lg shadow-md p-5 bg-gray-50 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 ${
                isPending ? 'pointer-events-none opacity-70' : ''
              }`}
              onClick={() => handleEntryClick(entry)}
            >
              <h3 className="text-xl font-semibold dark:text-white">
                {entry.headwords.join(', ')}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {entry.englishTerms.map((term, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full text-sm"
                  >
                    {term}
                  </span>
                ))}
              </div>
              <div className="flex justify-center mt-2">
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedEntry && (
        <EntryDetails
          entry={selectedEntry}
          onBack={handleBack}
          isSlideIn={slideAnimation}
        />
      )}
    </>
  );
};

export default RecentEntries;
