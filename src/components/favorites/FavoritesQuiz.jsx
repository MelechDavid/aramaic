import React, { useState } from 'react';
import { useFavoritesContext } from '../../context/FavoritesContext';

const MIN_FAVORITES = 4;

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const generateQuestions = (favorites) => {
  return shuffleArray(favorites).map((entry) => {
    const distractors = shuffleArray(favorites.filter(e => e.id !== entry.id))
      .slice(0, 3)
      .map(e => e.englishTerms[0] || e.englishTerms.join(', '));

    const correctAnswer = entry.englishTerms[0] || entry.englishTerms.join(', ');
    const options = shuffleArray([correctAnswer, ...distractors]);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      aramaic: entry.headwords.join(' / '),
      options,
      correct: correctIndex,
    };
  });
};

const FavoritesQuiz = () => {
  const { favorites } = useFavoritesContext();

  const [questions, setQuestions] = useState(() =>
    favorites.length >= MIN_FAVORITES ? generateQuestions(favorites) : []
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (favorites.length < MIN_FAVORITES) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="font-medium text-lg">Not enough favorites</p>
        <p className="text-sm mt-2">
          You need at least {MIN_FAVORITES} favorites to start a quiz.
          <br />
          You currently have {favorites.length}.
        </p>
      </div>
    );
  }

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === questions[currentQuestion].correct) {
      setCorrectAnswers(c => c + 1);
    }
    setTimeout(() => setShowNext(true), 400);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowNext(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setQuestions(generateQuestions(favorites));
    setCurrentQuestion(0);
    setSelectedOption(null);
    setCorrectAnswers(0);
    setShowNext(false);
    setQuizCompleted(false);
  };

  const getOptionClass = (index) => {
    const base = 'w-full text-left p-4 border rounded-xl mb-3 transition-all duration-300 font-medium text-sm';
    if (selectedOption === null) {
      return `${base} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-pink-400`;
    }
    if (index === questions[currentQuestion].correct) {
      return `${base} bg-green-600 border-green-600 text-white`;
    }
    if (index === selectedOption) {
      return `${base} bg-red-600 border-red-600 text-white`;
    }
    return `${base} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500`;
  };

  if (quizCompleted) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Quiz Complete!</h3>
        <div className="text-5xl font-bold text-pink-600 mb-3">
          {correctAnswers} / {questions.length}
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-10">
          {correctAnswers === questions.length
            ? 'Perfect! Outstanding work!'
            : correctAnswers >= questions.length * 0.8
            ? 'Great job! You know these well!'
            : correctAnswers >= questions.length * 0.6
            ? 'Good effort! Keep reviewing.'
            : "Keep studying — you'll get there!"}
        </p>
        <button
          onClick={handleRestart}
          className="px-8 py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-pink-600 uppercase tracking-wider">
          Favorites Quiz
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentQuestion + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 w-full mb-6">
        <div
          className="bg-pink-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
        What does this Aramaic word mean?
      </p>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
        {q.aramaic}
      </h3>

      <div>
        {q.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClass(index)}
            onClick={() => handleOptionSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>

      {showNext && (
        <div className="mt-4 text-center">
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors"
          >
            {currentQuestion < questions.length - 1 ? 'Next' : 'See Results'}
          </button>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-400 dark:text-gray-500">
        Score: {correctAnswers} / {questions.length}
      </div>
    </div>
  );
};

export default FavoritesQuiz;
