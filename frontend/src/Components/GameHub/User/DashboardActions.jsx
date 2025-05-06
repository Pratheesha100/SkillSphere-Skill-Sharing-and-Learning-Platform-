import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Start Quiz',
      description: 'Test your knowledge with multiple choice questions',
      icon: '📝',
      path: '/quiz',
      color: 'bg-blue-500'
    },
    {
      title: 'Memory Match',
      description: 'Challenge your memory with matching exercises',
      icon: '🧩',
      path: '/memory-match',
      color: 'bg-purple-500'
    },
    {
      title: 'View Progress',
      description: 'Check your achievements and XP',
      icon: '🏆',
      path: '/progress',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => navigate(action.path)}
          className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200"
        >
          <div className="p-6">
            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-200`}>
              <span className="text-2xl">{action.icon}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-gray-600">{action.description}</p>
          </div>
          <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-200" />
        </button>
      ))}
    </div>
  );
};

export default DashboardActions;