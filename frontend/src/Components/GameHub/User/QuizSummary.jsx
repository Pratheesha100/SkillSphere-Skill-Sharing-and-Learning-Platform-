import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-6">Please complete a quiz to see your results.</p>
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

  const score = (results.correctAnswers / results.totalQuestions) * 100;
  const xpEarned = Math.round(score / 10); // 1 XP per 10 points
  const badges = [];
  
  if (score >= 90) badges.push('Quiz Master');
  if (score >= 75) badges.push('Quick Learner');
  if (score >= 60) badges.push('Getting Started');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Results</h1>
            <div className="text-4xl font-bold text-white mb-2">{score.toFixed(1)}%</div>
            <p className="text-indigo-100">
              {results.correctAnswers} out of {results.totalQuestions} correct
            </p>
          </div>

          {/* Stats */}
          <div className="p-6 grid grid-cols-2 gap-4 border-b border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{xpEarned}</div>
              <div className="text-sm text-gray-600">XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.floor(results.timeTaken / 60)}:{(results.timeTaken % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600">Time Taken</div>
            </div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Badges Earned</h2>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/game-hub')}
              className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Return to Game Hub
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Another Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSummary;