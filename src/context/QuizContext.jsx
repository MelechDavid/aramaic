import React, { createContext, useContext, useState } from 'react';

// Create the context
const QuizContext = createContext();

// Custom hook to use the quiz context
export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizContextProvider');
  }
  return context;
};

// Provider component
export const QuizContextProvider = ({ children }) => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const openQuiz = () => setIsQuizOpen(true);
  const closeQuiz = () => setIsQuizOpen(false);

  // Value to be provided by the context
  const value = {
    isQuizOpen,
    openQuiz,
    closeQuiz
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export default QuizContextProvider;