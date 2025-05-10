import React from 'react';

const CategorySelection = ({ onSelectCategory }) => {
  const categories = [
    { id: 'ICT', name: 'Information Technology', icon: '💻' },
    { id: 'MATH', name: 'Mathematics', icon: '📐' },
    { id: 'SCIENCE', name: 'Science', icon: '🔬' },
    { id: 'GENERAL', name: 'General Knowledge', icon: '🎯' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="group relative bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-indigo-500 hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </span>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                {category.name}
              </h3>
            </div>
            <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-200" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;