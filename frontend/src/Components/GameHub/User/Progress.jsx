import React, { useState, useEffect } from 'react';
import XPProgress from './XPProgress';
import axios from 'axios';

const Progress = () => {
  const [progressData, setProgressData] = useState({
    currentXP: 0,
    level: 1,
    nextLevelXP: 100
  });

  useEffect(() => {
    // TODO: Replace with actual API call when backend is ready
    const fetchProgress = async () => {
      try {
        // const response = await axios.get('http://localhost:8080/api/user/progress');
        // setProgressData(response.data);
        
        // Temporary mock data
        setProgressData({
          currentXP: 75,
          level: 2,
          nextLevelXP: 200
        });
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
          <p className="text-gray-600 mt-1">Track your learning journey</p>
        </div>

        {/* XP Progress */}
        <XPProgress 
          currentXP={progressData.currentXP}
          level={progressData.level}
          nextLevelXP={progressData.nextLevelXP}
        />

        {/* Additional progress sections can be added here */}
      </div>
    </div>
  );
};

export default Progress;