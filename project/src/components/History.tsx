import React from 'react';
import { Clock, Target, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const History: React.FC = () => {
  const { state } = useApp();
  
  if (state.isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading sessions...</p>
        </div>
      </div>
    );
  }
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };
  
  const getTotalStats = () => {
    const completedSessions = state.sessions.filter(s => s.isCompleted);
    const totalDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalDistractions = completedSessions.reduce((sum, s) => sum + s.distractions, 0);
    
    return {
      completedSessions: completedSessions.length,
      totalSessions: state.sessions.length,
      totalDuration: Math.floor(totalDuration / 60),
      averageDistractions: completedSessions.length > 0 
        ? Math.round(totalDistractions / completedSessions.length * 10) / 10 
        : 0
    };
  };
  
  const stats = getTotalStats();
  
  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Session History</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.completedSessions}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed Sessions</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalDuration}m</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Focus Time</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {state.sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>No focus sessions yet</p>
            <p className="text-sm">Start your first session to see history</p>
          </div>
        ) : (
          state.sessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-lg border-2 ${
                session.isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(session.startTime)}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  session.isCompleted
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {session.isCompleted ? 'Completed' : 'Interrupted'}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatDuration(session.duration)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">{formatDuration(session.targetDuration)}</span>
                  </div>
                  
                  {session.distractions > 0 && (
                    <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{session.distractions}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    {Math.round((session.duration / session.targetDuration) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">completion</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;