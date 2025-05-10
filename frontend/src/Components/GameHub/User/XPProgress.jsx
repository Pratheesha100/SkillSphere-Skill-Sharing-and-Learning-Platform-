import React from 'react';

const XPProgress = ({ currentXP, level, nextLevelXP }) => {
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Level {level}</h2>
          <p className="text-sm text-gray-600">XP Progress</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">{currentXP}</div>
          <div className="text-sm text-gray-600">/ {nextLevelXP} XP</div>
        </div>
      </div>

      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-600">Level {level}</span>
          <span className="text-xs text-gray-600">Level {level + 1}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-2">
        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-sm font-medium text-gray-900">
          {nextLevelXP - currentXP} XP to next level
        </span>
      </div>
    </div>
  );
};

export default XPProgress;