import React, { createContext, useContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

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
  const [quizFavorites, setQuizFavorites] = useLocalStorage('aramaic-quiz-favorites', []);
  const [archivedQuestions, setArchivedQuestions] = useLocalStorage('aramaic-quiz-archived', []);

  const openQuiz = () => setIsQuizOpen(true);
  const closeQuiz = () => setIsQuizOpen(false);

  // Quiz favorites (by question text as unique key)
  const isQuizFavorite = (question) => {
    const list = Array.isArray(quizFavorites) ? quizFavorites : [];
    return list.includes(question);
  };

  const toggleQuizFavorite = (question) => {
    setQuizFavorites(prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (list.includes(question)) {
        return list.filter(q => q !== question);
      }
      return [...list, question];
    });
  };

  // Archived questions (by question text as unique key)
  const isArchived = (question) => {
    const list = Array.isArray(archivedQuestions) ? archivedQuestions : [];
    return list.includes(question);
  };

  const archiveQuestion = (question) => {
    setArchivedQuestions(prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (list.includes(question)) return list;
      return [...list, question];
    });
  };

  const unarchiveQuestion = (question) => {
    setArchivedQuestions(prev => {
      const list = Array.isArray(prev) ? prev : [];
      return list.filter(q => q !== question);
    });
  };

  const unarchiveAll = () => {
    setArchivedQuestions([]);
  };

  // Value to be provided by the context
  const value = {
    isQuizOpen,
    openQuiz,
    closeQuiz,
    quizFavorites: Array.isArray(quizFavorites) ? quizFavorites : [],
    isQuizFavorite,
    toggleQuizFavorite,
    archivedQuestions: Array.isArray(archivedQuestions) ? archivedQuestions : [],
    isArchived,
    archiveQuestion,
    unarchiveQuestion,
    unarchiveAll,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export default QuizContextProvider;