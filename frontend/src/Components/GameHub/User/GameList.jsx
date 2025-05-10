import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameList = ({ games, category }) => {
  const navigate = useNavigate();

  const getGameIcon = (type) => {
    switch (type) {
      case 'MCQ':
        return '📝';
      case 'MEMORY_MATCH':
        return '🧩';
      default:
        return '🎮';
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'EASY':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HARD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!games || games.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Games Available</h3>
        <p className="text-gray-600">There are no games available in this category at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div
          key={game.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{getGameIcon(game.type)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{game.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{game.description}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(game.level)}`}>
                {game.level}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {game.estimatedTime} min
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {game.type === 'MCQ' ? 'Multiple Choice' : 'Memory Match'}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate(game.type === 'MCQ' ? '/quiz' : '/memory-match')}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;