import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Timer from './Timer';
import Swal from 'sweetalert2';

const MemoryMatchGame = () => {
  const [game, setGame] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [activeBlank, setActiveBlank] = useState(0);
  const [draggedOption, setDraggedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGame();
  }, []);

  const fetchGame = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/games');
      const memoryMatchGames = response.data.filter(game => game.type === 'MEMORY_MATCH');
      if (memoryMatchGames.length > 0) {
        setGame(memoryMatchGames[0]);
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load game. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    if (!game) return;
    if (selectedOptions.includes(option)) return;
    const newOptions = [...selectedOptions];
    newOptions[activeBlank] = option;
    setSelectedOptions(newOptions);
    if (activeBlank < game.blanks.length - 1) {
      setActiveBlank(activeBlank + 1);
    }
  };

  const handleClearBlank = (index) => {
    const newOptions = [...selectedOptions];
    newOptions[index] = undefined;
    setSelectedOptions(newOptions);
    setActiveBlank(index);
  };

  const handleDrop = (index) => {
    if (!draggedOption || selectedOptions.includes(draggedOption)) return;
    const newOptions = [...selectedOptions];
    newOptions[index] = draggedOption;
    setSelectedOptions(newOptions);
    setActiveBlank(index < game.blanks.length - 1 ? index + 1 : index);
    setDraggedOption(null);
  };

  const handleSubmit = async () => {
    if (!game) return;
    if (selectedOptions.filter(Boolean).length !== game.blanks.length) {
      Swal.fire({
        title: 'Incomplete',
        text: 'Please fill in all blanks before submitting.',
        icon: 'warning'
      });
      return;
    }

    const isCorrect = selectedOptions.every((option, index) => option === game.blanks[index]);
    const results = {
      score: isCorrect ? 100 : 0,
      timeTaken: 300 - timeLeft,
      answers: selectedOptions,
      correctAnswers: isCorrect ? game.blanks.length : 0,
      totalQuestions: game.blanks.length
    };

    await Swal.fire({
      title: 'Game Completed!',
      text: isCorrect ? 'Perfect Score!' : 'Keep practicing!',
      icon: isCorrect ? 'success' : 'info',
      confirmButtonText: 'View Summary'
    });

    navigate('/gamehub/memory-match-summary', { state: { results } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Game Available</h2>
          <p className="text-gray-600 mb-6">There are no memory match games available at the moment.</p>
          <button
            onClick={() => navigate('/game-hub')}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Game Hub
          </button>
        </div>
      </div>
    );
  }

  // Render paragraph with interactive blanks
  const paragraphParts = game.paragraph.split('___');
  const paragraph = paragraphParts.map((part, index) => {
    if (index === paragraphParts.length - 1) return part;
    return (
      <React.Fragment key={index}>
        {part}
        <span
          className={`inline-block w-24 h-8 mx-1 border-b-2 border-indigo-500 cursor-pointer ${activeBlank === index ? 'bg-indigo-100' : ''}`}
          onClick={() => setActiveBlank(index)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            handleDrop(index);
          }}
        >
          {selectedOptions[index] || ''}
          {selectedOptions[index] && (
            <button
              className="ml-1 text-red-500"
              onClick={e => {
                e.stopPropagation();
                handleClearBlank(index);
              }}
            >×</button>
          )}
        </span>
      </React.Fragment>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Memory Match</h1>
            <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} onTimeUp={handleSubmit} />
          </div>
        </div>

        {/* Game Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Paragraph */}
          <div className="p-6 border-b border-gray-100">
            <p className="text-lg text-gray-700 leading-relaxed">{paragraph}</p>
          </div>

          {/* Options */}
          <div className="p-6 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Options</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {game.options.map((option, index) => (
                <button
                  key={index}
                  draggable
                  onDragStart={() => setDraggedOption(option)}
                  onDragEnd={() => setDraggedOption(null)}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOptions.includes(option)}
                  className={`p-3 rounded-lg text-center transition-all duration-200
                    ${selectedOptions.includes(option)
                      ? 'bg-indigo-100 text-indigo-800 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-6 bg-white border-t border-gray-100">
            <button
              onClick={handleSubmit}
              disabled={selectedOptions.filter(Boolean).length !== game.blanks.length}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200
                ${selectedOptions.filter(Boolean).length !== game.blanks.length
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }
              `}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryMatchGame;