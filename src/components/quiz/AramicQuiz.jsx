import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../../roughquiz/quizdata/styles.css';
import { quizData, quizCategories } from '../../data/quiz';
import { useQuizContext } from '../../context/QuizContext';

// Fisher-Yates shuffle
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const categoryNames = Object.keys(quizCategories);

const AramicQuiz = () => {
  const {
    isQuizFavorite, toggleQuizFavorite,
    isArchived, archiveQuestion, unarchiveQuestion, unarchiveAll,
    archivedQuestions,
  } = useQuizContext();

  // Settings state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [incorrectOption, setIncorrectOption] = useState(null);
  const [skippedCount, setSkippedCount] = useState(0);
  const [answerHistory, setAnswerHistory] = useState([]); // { selected, wasCorrect } per index
  const quizTopRef = useRef(null);

  // Build filtered questions whenever quiz starts
  const startQuiz = () => {
    let pool = selectedCategory === 'All'
      ? [...quizData]
      : [...(quizCategories[selectedCategory] || [])];

    // Exclude archived
    pool = pool.filter(q => !isArchived(q.question));

    if (pool.length === 0) {
      alert('No questions available! Try a different category or unarchive some questions.');
      return;
    }

    if (shuffleEnabled) {
      pool = shuffleArray(pool);
    }

    setQuestions(pool);
    setCurrentQuestion(0);
    setQuizCompleted(false);
    setSelectedOption(null);
    setShowExplanation(false);
    setIncorrectOption(null);
    setCorrectAnswers(0);
    setSkippedCount(0);
    setAnswerHistory([]);
    setQuizStarted(true);
  };

  const handleOptionSelect = (optionIndex) => {
    if (selectedOption !== null || showExplanation) return;

    setSelectedOption(optionIndex);

    const isCorrect = optionIndex === questions[currentQuestion].correct;

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setIncorrectOption(optionIndex);
    }

    // Record answer
    setAnswerHistory(prev => {
      const copy = [...prev];
      copy[currentQuestion] = { selected: optionIndex, wasCorrect: isCorrect };
      return copy;
    });

    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const advanceQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setIncorrectOption(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }

    setTimeout(() => {
      if (quizTopRef.current) {
        quizTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleSkip = () => {
    setSkippedCount(prev => prev + 1);
    setAnswerHistory(prev => {
      const copy = [...prev];
      copy[currentQuestion] = { selected: null, wasCorrect: false, skipped: true };
      return copy;
    });
    setSelectedOption(null);
    setShowExplanation(false);
    setIncorrectOption(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }

    setTimeout(() => {
      if (quizTopRef.current) {
        quizTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handlePrevious = () => {
    if (currentQuestion <= 0) return;
    const prevIdx = currentQuestion - 1;
    const prev = answerHistory[prevIdx];
    setCurrentQuestion(prevIdx);
    if (prev && !prev.skipped) {
      setSelectedOption(prev.selected);
      setIncorrectOption(prev.wasCorrect ? null : prev.selected);
      setShowExplanation(true);
    } else {
      setSelectedOption(null);
      setIncorrectOption(null);
      setShowExplanation(false);
    }
    setTimeout(() => {
      if (quizTopRef.current) {
        quizTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
  };

  const getOptionClass = (index) => {
    let baseClass = "quiz-option text-black dark:text-white relative p-4 border rounded-lg mb-3 cursor-pointer transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800";

    if (selectedOption === null) return `${baseClass} text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700`;

    if (selectedOption === index) {
      if (index === questions[currentQuestion].correct) {
        return `${baseClass} correct bg-green-600 text-white border-green-600`;
      } else {
        return `${baseClass} incorrect bg-red-600 text-white border-red-600`;
      }
    }

    if (index === questions[currentQuestion].correct && showExplanation) {
      return `${baseClass} correct-answer bg-green-600 text-white border-green-600`;
    }

    return `${baseClass} text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700`;
  };

  // ─── Archived Questions View ───
  if (showArchived) {
    const archivedItems = quizData.filter(q => isArchived(q.question));
    return (
      <div ref={quizTopRef} className="quiz-container max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-gray-800 dark:text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Archived Questions</h2>
          <button
            onClick={() => setShowArchived(false)}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ← Back
          </button>
        </div>

        {archivedItems.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No archived questions.</p>
        ) : (
          <>
            <div className="mb-4 text-right">
              <button
                onClick={unarchiveAll}
                className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Unarchive All ({archivedItems.length})
              </button>
            </div>
            <div className="space-y-3">
              {archivedItems.map((q, i) => (
                <div key={i} className="flex items-start justify-between gap-3 p-4 border rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-pink-600 mb-1">{q.category}</div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{q.question}</p>
                  </div>
                  <button
                    onClick={() => unarchiveQuestion(q.question)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Unarchive
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // ─── Setup Screen ───
  if (!quizStarted || quizCompleted) {
    const totalAvailable = (selectedCategory === 'All' ? quizData : (quizCategories[selectedCategory] || []))
      .filter(q => !isArchived(q.question)).length;

    if (quizCompleted) {
      const answered = questions.length - skippedCount;
      return (
        <div ref={quizTopRef} className="quiz-completion p-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl text-gray-800 dark:text-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Quiz Completed!</h2>

          <div className="score-display text-center mb-8">
            <div className="text-4xl font-bold mb-2 text-pink-600">{correctAnswers} / {answered}</div>
            {skippedCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">({skippedCount} skipped)</p>
            )}
            <p className="text-gray-600 dark:text-gray-400">
              {correctAnswers === answered && answered > 0 ? 'Perfect score! Excellent work!' :
              correctAnswers >= answered * 0.8 ? 'Great job! You know your Aramaic well!' :
              correctAnswers >= answered * 0.6 ? 'Good effort! Keep practicing!' :
              'Keep studying! You\'ll improve with practice.'}
            </p>
          </div>

          <div className="text-center space-x-3">
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition-colors"
            >
              New Quiz
            </button>
          </div>
        </div>
      );
    }

    // Setup / start screen
    return (
      <div ref={quizTopRef} className="quiz-container max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-gray-800 dark:text-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Aramaic Quiz</h2>

        {/* Category selector */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="All">All Categories ({quizData.filter(q => !isArchived(q.question)).length} questions)</option>
            {categoryNames.map(name => {
              const count = quizCategories[name].filter(q => !isArchived(q.question)).length;
              return (
                <option key={name} value={name}>{name} ({count})</option>
              );
            })}
          </select>
        </div>

        {/* Shuffle toggle */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Shuffle Questions</span>
          <button
            onClick={() => setShuffleEnabled(!shuffleEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${shuffleEnabled ? 'bg-pink-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shuffleEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Available count */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          {totalAvailable} question{totalAvailable !== 1 ? 's' : ''} available
        </p>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={startQuiz}
            disabled={totalAvailable === 0}
            className="w-full max-w-xs px-6 py-3 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Quiz
          </button>

          <button
            onClick={() => setShowArchived(true)}
            className="w-full max-w-xs px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            Archived Questions {archivedQuestions.length > 0 ? `(${archivedQuestions.length})` : ''}
          </button>
        </div>
      </div>
    );
  }

  // ─── Active Quiz ───
  const q = questions[currentQuestion];
  const isFav = isQuizFavorite(q.question);

  return (
    <div ref={quizTopRef} className="quiz-container max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-gray-800 dark:text-gray-200">
      <div className="quiz-header mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Aramaic Quiz</h2>
          <div className="quiz-progress text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <div className="progress-bar bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-full">
          <div
            className="bg-pink-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="quiz-question mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="category text-sm font-medium text-pink-600">
            {q.category}
          </div>
          {/* Favorite button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleQuizFavorite(q.question)}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isFav ? 'Remove from quiz favorites' : 'Add to quiz favorites'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill={isFav ? '#ec4899' : 'none'} stroke={isFav ? '#ec4899' : 'currentColor'} strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {q.question}
        </h3>

        <div className="options-container">
          {q.options.map((option, index) => (
            <div
              key={index}
              className={getOptionClass(index)}
              onClick={() => handleOptionSelect(index)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      {/* Skip + Previous buttons - only before answering */}
      {selectedOption === null && !showExplanation && (
        <div className="flex justify-center items-center gap-3 mb-4">
          {currentQuestion > 0 && (
            <button
              onClick={handlePrevious}
              className="px-5 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              ← Previous
            </button>
          )}
          <button
            onClick={handleSkip}
            className="px-5 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Skip →
          </button>
        </div>
      )}

      {showExplanation && (
        <div className="explanation mt-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
          <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Explanation:</h4>
          <div dangerouslySetInnerHTML={{ __html: q.explanation }} />

          {q.diagram && (
            <div className="diagram mt-4" dangerouslySetInnerHTML={{ __html: q.diagram }} />
          )}

          <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
            {currentQuestion > 0 && (
              <button
                onClick={handlePrevious}
                className="px-5 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                ← Previous
              </button>
            )}
            <button
              onClick={advanceQuestion}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition-colors"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
            </button>
            <button
              onClick={() => {
                archiveQuestion(q.question);
                // Auto-advance after archiving
                const updated = questions.filter((_, i) => i !== currentQuestion);
                if (updated.length === 0) {
                  setQuizCompleted(true);
                  return;
                }
                setQuestions(updated);
                const nextIdx = currentQuestion >= updated.length ? updated.length - 1 : currentQuestion;
                setCurrentQuestion(nextIdx);
                setSelectedOption(null);
                setShowExplanation(false);
                setIncorrectOption(null);
              }}
              className="px-5 py-2 text-sm text-orange-700 dark:text-orange-300 border border-orange-400 dark:border-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
            >
              Archive Question
            </button>
          </div>
        </div>
      )}

      <div className="score-display mt-8 text-lg font-semibold text-center">
        Current Score: {correctAnswers} / {questions.length}
        {skippedCount > 0 && <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">({skippedCount} skipped)</span>}
      </div>
    </div>
  );
};

export default AramicQuiz;