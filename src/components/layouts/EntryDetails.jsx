import React, { useEffect, forwardRef } from "react";
import FavoriteButton from "../buttons/FavoriteButton";

const EntryDetails = forwardRef(({ entry, onBack, isSlideIn }, ref) => {
  if (!entry) return null;

  // Disable scrolling on the body when entry details are visible
  useEffect(() => {
    if (isSlideIn) {
      // Lock main body scrolling when entry is open
      document.body.classList.add('entry-details-open');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Restore scrolling when entry is closed
      const scrollY = document.body.style.top;
      document.body.classList.remove('entry-details-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    return () => {
      // Cleanup in case component unmounts 
      document.body.classList.remove('entry-details-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isSlideIn]);

  // Use different classes - start from the right side when opening
  const slideClass = isSlideIn ? 'translate-x-0' : 'translate-x-full';

  return (
    <div 
      className={`fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${slideClass}`}
      style={{ willChange: 'transform' }}
    >
      {/* Fixed header with back button that stays visible when scrolling */}
      <div className="sticky top-0 left-0 z-[51] bg-gradient-to-b from-white dark:from-gray-900 to-transparent pt-4 pb-8 pointer-events-none">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all hover:scale-110 pointer-events-auto"
          aria-label="Back to search results"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="p-4 max-w-3xl mx-auto">
        {/* Entry content */}        <div className="pt-12 pb-16">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex-1">
              {entry.headwords.join(", ")}
            </h1>            <div className="flex items-center gap-2 ml-4">
              <FavoriteButton 
                word={entry.headwords.join(", ")}
                definition={entry.definition || entry.englishTerms.join(", ")}
                pronunciation={entry.headwords.join(", ")}
              />
            </div>
          </div>

          {/* English Terms */}
          <div className="flex flex-wrap gap-2 mb-6">
            {entry.englishTerms.map((term, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full text-sm"
              >
                {term}
              </span>
            ))}
          </div>

          {/* Definition */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
            <section className="mb-5">
              {entry.definition === "Loading..." ? (
                <div className="flex justify-center py-8">
                  <div className="w-10 h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div
                  className="dictionary-entry text-gray-700 dark:text-gray-200 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: entry.definition }}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>  );
});

export default EntryDetails;