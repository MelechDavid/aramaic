import React, { useState, useEffect } from 'react';
import '../../roughquiz/quizdata/styles.css';
import { quizData } from '../../data/quiz';

const AramicQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [incorrectOption, setIncorrectOption] = useState(null);
  
  // Quiz configuration
  const quizConfig = {
    features: {
      sounds: false,
      animations: true,
      translations: true
    }
  };

  const handleOptionSelect = (optionIndex) => {
    if (selectedOption !== null || showExplanation) return;
    
    setSelectedOption(optionIndex);
    
    const isCorrect = optionIndex === quizData[currentQuestion].correct;
    
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectOption(optionIndex);
    }
    
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setIncorrectOption(null);
    
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setQuizCompleted(false);
    setSelectedOption(null);
    setShowExplanation(false);
    setIncorrectOption(null);
    setCorrectAnswers(0);
  };

  const getOptionClass = (index) => {
    // back button floating turned black because of what I did below here to fix correct/wrong answer hard to see
    let baseClass = "quiz-option text-black dark:text-white relative p-4 border rounded-lg mb-3 cursor-pointer transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800";
    
    if (selectedOption === null) return `${baseClass} text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700`; 
    
    if (selectedOption === index) {
      if (index === quizData[currentQuestion].correct) {
        return `${baseClass} correct bg-green-600 text-white border-green-600`;
      } else {
        return `${baseClass} incorrect bg-red-600 text-white border-red-600`;
      }
    }
    // correct or wrong answer turns white here 
    if (index === quizData[currentQuestion].correct && showExplanation) {
      return `${baseClass} correct-answer bg-green-600 text-white border-green-600`;
    }
    
    return `${baseClass} text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700`; 
  };

  if (quizCompleted) {
    return (
      <div className="quiz-completion p-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl text-gray-800 dark:text-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Quiz Completed!</h2>
        
        <div className="score-display text-center mb-8">
          <div className="text-4xl font-bold mb-2 text-pink-600">{correctAnswers} / {quizData.length}</div>
          <p className="text-gray-600 dark:text-gray-400">
            {correctAnswers === quizData.length ? 'Perfect score! Excellent work!' :
            correctAnswers >= quizData.length * 0.8 ? 'Great job! You know your Aramaic well!' :
            correctAnswers >= quizData.length * 0.6 ? 'Good effort! Keep practicing!' :
            'Keep studying! You\'ll improve with practice.'}
          </p>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleRestartQuiz}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition-colors"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-gray-800 dark:text-gray-200">
      <div className="quiz-header mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Aramaic Quiz</h2>
          <div className="quiz-progress text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {quizData.length}
          </div>
        </div>
        
        <div className="progress-bar bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-full">
          <div
            className="bg-pink-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="quiz-question mb-6">
        <div className="category text-sm font-medium text-pink-600 mb-2">
          {quizData[currentQuestion].category}
        </div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {quizData[currentQuestion].question}
        </h3>
        
        <div className="options-container">
          {quizData[currentQuestion].options.map((option, index) => (
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
      
      {showExplanation && (
        <div className="explanation mt-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
          <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Explanation:</h4>
          <div dangerouslySetInnerHTML={{ __html: quizData[currentQuestion].explanation }} />
          
          {quizData[currentQuestion].diagram && (
            <div className="diagram mt-4" dangerouslySetInnerHTML={{ __html: quizData[currentQuestion].diagram }} />
          )}
          
          <div className="mt-6 text-center">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition-colors"
            >
              {currentQuestion < quizData.length - 1 ? 'Next Question' : 'Complete Quiz'}
            </button>
          </div>
        </div>
      )}
      
      <div className="score-display mt-8 text-lg font-semibold text-center">
        Current Score: {correctAnswers} / {quizData.length}
      </div>
    </div>
  );
};

export default AramicQuiz;