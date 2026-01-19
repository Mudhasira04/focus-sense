import React, { useState } from 'react';
import { Play, Pause, Square, Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Timer: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedDuration, setSelectedDuration] = useState(25);
  
  const { timer } = state;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStart = () => {
    dispatch({ type: 'START_TIMER', payload: selectedDuration * 60 });
  };
  
  const handleStop = () => {
    dispatch({ type: 'STOP_TIMER' });
  };
  
  const handleAddDistraction = () => {
    dispatch({ type: 'ADD_DISTRACTION' });
  };
  
  const progress = timer.targetDuration > 0 
    ? ((timer.targetDuration - timer.timeLeft) / timer.targetDuration) * 100 
    : 0;
  
  const durations = [15, 25, 30, 45, 60];
  
  return (
    <div className="p-6 dark:bg-gray-900">
      {!timer.isRunning && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Focus Duration</h2>
          <div className="grid grid-cols-3 gap-3">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectedDuration === duration
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {duration}m
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64 mb-8">
          <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="text-blue-600 dark:text-blue-400 transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              {formatTime(timer.timeLeft)}
            </div>
            {timer.currentSession && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Distractions: {timer.currentSession.distractions}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-4 mb-6">
          {!timer.isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Start</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleStop}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Square className="w-5 h-5" />
                <span>Stop</span>
              </button>
            </>
          )}
        </div>
        
        {timer.isRunning && (
          <button
            onClick={handleAddDistraction}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 dark:bg-orange-400 dark:hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Distraction</span>
          </button>
        )}
        
        {timer.timeLeft === 0 && !timer.isRunning && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-800 dark:text-green-400 px-4 py-2 rounded-lg">
            🎉 Focus session completed!
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;