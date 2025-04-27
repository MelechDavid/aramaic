import React, { useEffect } from "react";
import AramicQuiz from "./AramicQuiz";

const QuizModal = ({ isOpen, onClose }) => {
  // Disable scrolling on the body when quiz is visible
  useEffect(() => {
    if (isOpen) {
      // Lock main body scrolling when quiz is open
      document.body.classList.add('quiz-modal-open');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Restore scrolling when quiz is closed
      const scrollY = document.body.style.top;
      document.body.classList.remove('quiz-modal-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    return () => {
      // Cleanup in case component unmounts 
      document.body.classList.remove('quiz-modal-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  // Use different classes for the slide transition
  const slideClass = isOpen ? 'translate-x-0' : 'translate-x-full';

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${slideClass}`}
      style={{ willChange: 'transform' }}
    >
      {/* Back button to close the quiz */}
      <div className="sticky top-0 left-0 z-[51] bg-gradient-to-b from-white dark:from-gray-900 to-transparent pt-4 pb-8 pointer-events-none">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all hover:scale-110 pointer-events-auto"
          aria-label="Back to dictionary"
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

      <div className="p-4 max-w-5xl mx-auto">
        <div className="pt-12 pb-16">
          <AramicQuiz />
        </div>
      </div>
    </div>
  );
};

export default QuizModal;