import React from 'react';

const RecentGames = ({ games }) => {
  if (!games || games.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Games</h2>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">No recent games played</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Games</h2>
      <div className="space-y-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                game.type === 'MCQ' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                <span className="text-lg">
                  {game.type === 'MCQ' ? '📝' : '🧩'}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{game.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(game.completedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">{game.score}%</div>
              <div className="text-sm text-gray-600">{game.xpEarned} XP</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentGames;