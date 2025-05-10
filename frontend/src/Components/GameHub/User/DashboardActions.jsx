import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Start Quiz',
      description: 'Test your knowledge with multiple choice questions',
      icon: '🎯',
      secondaryIcon: '📚',
      path: '/gamehub/quiz',
      color: 'from-blue-500 to-indigo-600',
      stats: { completed: 12, achievements: 3 }
    },
    {
      title: 'Memory Match',
      description: 'Challenge your memory with matching exercises',
      icon: '🧩',
      secondaryIcon: '🔮',
      path: '/gamehub/memory-match',
      color: 'from-purple-500 to-pink-500',
      stats: { completed: 8, achievements: 2 }
    },
    {
      title: 'View Progress',
      description: 'Track your learning journey and achievements',
      icon: '🏆',
      secondaryIcon: '⭐',
      path: '/gamehub/progress',
      color: 'from-yellow-400 to-orange-500',
      stats: { level: 5, xp: 1250 }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {actions.map((action, index) => (
        <motion.button
          key={index}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.03,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(action.path)}
          className="group relative bg-gradient-to-br bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          
          <div className="relative p-6 z-10">
            {/* Main Content */}
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                <span className="text-3xl filter drop-shadow-md">{action.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  {action.description}
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                  {action.secondaryIcon}
                </span>
                <div className="text-sm text-gray-600">
                  {action.stats.completed && (
                    <span>{action.stats.completed} completed</span>
                  )}
                  {action.stats.level && (
                    <span>Level {action.stats.level}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {action.stats.achievements && [...Array(action.stats.achievements)].map((_, i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                ))}
                {action.stats.xp && (
                  <span className="text-sm font-medium text-indigo-600">{action.stats.xp} XP</span>
                )}
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-300" />
          <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-all duration-300 transform rotate-12 blur-xl" />
        </motion.button>
      ))}
    </motion.div>
  );
};

export default DashboardActions;