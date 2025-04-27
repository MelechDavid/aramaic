import React, { useEffect } from "react";

const EntryDetails = ({ entry, onBack, isSlideIn }) => {
  if (!entry) return null;

  // Disable scrolling on the body when entry details are visible
  useEffect(() => {
    if (isSlideIn) {
      document.body.classList.add('entry-details-open');
    } else {
      document.body.classList.remove('entry-details-open');
    }
    
    return () => {
      document.body.classList.remove('entry-details-open');
    };
  }, [isSlideIn]);

  // Use different classes - start from the right side when opening
  const slideClass = isSlideIn ? 'translate-x-0' : 'translate-x-full';

  return (
    <div 
      className={`fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${slideClass}`}
      style={{ willChange: 'transform' }}
    >
      <div className="p-4 max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="fixed top-4 left-4 p-2 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 z-50 transition-all hover:scale-110"
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

        {/* Entry content */}
        <div className="pt-12 pb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {entry.headwords.join(", ")}
          </h1>

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
    </div>
  );
};

export default EntryDetails;