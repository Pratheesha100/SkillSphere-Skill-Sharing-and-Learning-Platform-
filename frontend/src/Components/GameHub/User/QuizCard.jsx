import React, { useState, useEffect } from 'react';

const QuizCard = ({ question, options, onAnswer, isLastQuestion, onFinishQuiz }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Reset states when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
  }, [question]); // Reset when question changes

  const handleOptionClick = (option) => {
    // Allow changing answer on last question until Finish Quiz is clicked
    if (isLastQuestion) {
      setSelectedOption(option);
      return;
    }
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsAnswered(true);
    onAnswer(selectedOption);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Question Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Question</h2>
        <p className="text-gray-600">{question}</p>
      </div>

      {/* Options */}
      <div className="p-6 space-y-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={!isLastQuestion && isAnswered}
            className={`w-full p-4 text-left rounded-lg transition-all duration-200
              ${selectedOption === option
                ? 'bg-indigo-50 border-2 border-indigo-500'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }
              ${!isLastQuestion && isAnswered ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-gray-200 mr-3">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-gray-700">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Submit and Finish Quiz Buttons */}
      <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-2">
        {!isLastQuestion && (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption || isAnswered}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200
              ${!selectedOption || isAnswered
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }
            `}
          >
            Next Question
          </button>
        )}
        {isLastQuestion && (
          <button
            onClick={() => onFinishQuiz(selectedOption)}
            disabled={!selectedOption}
            className="flex-1 py-3 px-6 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-200"
          >
            Finish Quiz
          </button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="h-1 bg-gray-100">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${!isLastQuestion && isAnswered ? '100%' : '0%'}` }}
        />
      </div>
    </div>
  );
};

export default QuizCard;