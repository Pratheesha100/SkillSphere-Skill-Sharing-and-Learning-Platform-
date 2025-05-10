import React, { useState, useEffect } from 'react';
import { gameService } from '../../../services/gameService';

const GameHistory = () => {
  const [gameResults, setGameResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('=== GameHistory Component Mounted ===');
    fetchGameResults();
  }, []);

  const fetchGameResults = async () => {
    try {
      console.log('Fetching game results...');
      const results = await gameService.getUserGameResults();
      console.log('Received results:', results);
      setGameResults(results);
      setLoading(false);
    } catch (err) {
      console.error('Error in fetchGameResults:', err);
      setError(err.message || 'Failed to load game history');
      setLoading(false);
    }
  };

  if (loading) {
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Game History</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchGameResults}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Game History</h1>
          </div>

          {gameResults.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No game results found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {gameResults.map((result) => (
                <div key={result.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {result.gameType === 'MCQ' ? 'Quiz' : 'Memory Match'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Category: {result.category} | Level: {result.level}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <div className="text-2xl font-bold text-indigo-600">{result.score}%</div>
                      <div className="text-sm text-gray-600">
                        Time: {Math.floor(result.timeTaken / 60)}:{(result.timeTaken % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm text-gray-600">
                        Played: {new Date(result.playedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHistory; 