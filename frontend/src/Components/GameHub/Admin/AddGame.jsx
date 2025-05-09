import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add MCQ Set',
      description: 'Create new multiple choice questions for quizzes',
      icon: '📝',
      secondaryIcon: '➕',
      path: '/admin/add-mcq-set',
      color: 'from-blue-500 to-indigo-600',
      stats: { total: 15, recent: 3 }
    },
    {
      title: 'Add Memory Match',
      description: 'Design new memory matching exercises',
      icon: '🧩',
      secondaryIcon: '➕',
      path: '/admin/add-memory-match-game',
      color: 'from-purple-500 to-pink-500',
      stats: { total: 10, recent: 2 }
    },
    {
      title: 'MCQ List',
      description: 'Manage and edit existing MCQ sets',
      icon: '📋',
      secondaryIcon: '✏️',
      path: '/admin/mcq-list',
      color: 'from-emerald-500 to-teal-600',
      stats: { active: 12, draft: 3 }
    },
    {
      title: 'Memory Match List',
      description: 'Manage memory match game content',
      icon: '🎮',
      secondaryIcon: '✏️',
      path: '/admin/memory-match-list',
      color: 'from-amber-500 to-orange-600',
      stats: { active: 8, draft: 2 }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your game content and exercises</p>
        </div>

        {/* Actions Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
              className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
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
                      {action.stats.total && (
                        <span>Total: {action.stats.total}</span>
                      )}
                      {action.stats.active && (
                        <span>Active: {action.stats.active}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {action.stats.recent && (
                      <span className="text-sm font-medium text-green-600">
                        {action.stats.recent} new
                      </span>
                    )}
                    {action.stats.draft && (
                      <span className="text-sm font-medium text-amber-600">
                        {action.stats.draft} drafts
                      </span>
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
      </div>
    </div>
  );
};

export default AdminDashboard;