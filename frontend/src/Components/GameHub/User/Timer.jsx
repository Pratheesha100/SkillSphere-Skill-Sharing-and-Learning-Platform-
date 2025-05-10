import React, { useEffect } from 'react';

const Timer = ({ timeLeft, setTimeLeft, onTimeUp }) => {
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, setTimeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            className="text-gray-200"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="20"
            cx="24"
            cy="24"
          />
          <circle
            className="text-indigo-600"
            strokeWidth="4"
            strokeDasharray={125.6}
            strokeDashoffset={125.6 - (timeLeft / 300) * 125.6}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="20"
            cx="24"
            cy="24"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-900">
            {`${minutes}:${seconds.toString().padStart(2, '0')}`}
          </span>
        </div>
      </div>
      <span className="text-sm text-gray-600">Time Remaining</span>
    </div>
  );
};

export default Timer;