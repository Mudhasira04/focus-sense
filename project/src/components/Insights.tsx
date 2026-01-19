import React from 'react';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Insights: React.FC = () => {
  const { state } = useApp();
  
  if (state.isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Analyzing your focus patterns...</p>
        </div>
      </div>
    );
  }
  
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };
  
  const getBestTimeWindow = () => {
    if (state.insights.length === 0) return null;
    return state.insights[0];
  };
  
  const getProductivityTrend = () => {
    const recentSessions = state.sessions.slice(0, 5);
    const olderSessions = state.sessions.slice(5, 10);
    
    if (recentSessions.length === 0) return null;
    
    const recentAvg = recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length;
    const olderAvg = olderSessions.length > 0 
      ? olderSessions.reduce((sum, s) => sum + s.duration, 0) / olderSessions.length 
      : recentAvg;
    
    const trend = recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';
    const percentage = olderAvg > 0 ? Math.abs((recentAvg - olderAvg) / olderAvg * 100) : 0;
    
    return { trend, percentage: Math.round(percentage) };
  };
  
  const bestTime = getBestTimeWindow();
  const trend = getProductivityTrend();
  
  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Focus Insights</h2>
      
      {state.sessions.length < 3 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p>Not enough data yet</p>
          <p className="text-sm">Complete at least 3 sessions to see insights</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Best Time Window */}
          {bestTime && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-6 rounded-xl text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-6 h-6" />
                <h3 className="text-xl font-semibold">Best Focus Time</h3>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatHour(bestTime.hour)} - {formatHour(bestTime.hour + 1)}
                </div>
                <div className="text-blue-100 dark:text-blue-200">
                  Average {Math.round(bestTime.averageDuration / 60)} minutes with {bestTime.averageDistractions.toFixed(1)} distractions
                </div>
                <div className="text-sm text-blue-200 dark:text-blue-300">
                  Based on {bestTime.sessionCount} session{bestTime.sessionCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
          
          {/* Productivity Trend */}
          {trend && (
            <div className={`p-6 rounded-xl ${
              trend.trend === 'improving' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' :
              trend.trend === 'declining' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700' :
              'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className={`w-6 h-6 ${
                  trend.trend === 'improving' ? 'text-green-600 dark:text-green-400' :
                  trend.trend === 'declining' ? 'text-red-600 dark:text-red-400' :
                  'text-blue-600 dark:text-blue-400'
                }`} />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Trend</h3>
              </div>
              <div className={`text-2xl font-bold mb-2 ${
                trend.trend === 'improving' ? 'text-green-600 dark:text-green-400' :
                trend.trend === 'declining' ? 'text-red-600 dark:text-red-400' :
                'text-blue-600 dark:text-blue-400'
              }`}>
                {trend.trend === 'improving' && '📈 '}
                {trend.trend === 'declining' && '📉 '}
                {trend.trend === 'stable' && '➡️ '}
                {trend.trend.charAt(0).toUpperCase() + trend.trend.slice(1)}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Your recent sessions are {trend.percentage}% {
                  trend.trend === 'improving' ? 'longer' :
                  trend.trend === 'declining' ? 'shorter' :
                  'similar in length'
                } compared to earlier ones
              </div>
            </div>
          )}
          
          {/* Hourly Breakdown */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Performance by Hour</h3>
            <div className="space-y-3">
              {state.insights.slice(0, 5).map((insight, index) => (
                <div key={insight.hour} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-100' :
                      index === 1 ? 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200' :
                      index === 2 ? 'bg-orange-200 dark:bg-orange-700 text-orange-800 dark:text-orange-200' :
                      'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {formatHour(insight.hour)} - {formatHour(insight.hour + 1)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {insight.sessionCount} session{insight.sessionCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {Math.round(insight.averageDuration / 60)}m
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {insight.averageDistractions.toFixed(1)} dist.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">💡 Recommendations</h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              {bestTime && (
                <div className="flex items-start space-x-2">
                  <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <p>Schedule your most important work around {formatHour(bestTime.hour)} when you're most focused.</p>
                </div>
              )}
              {trend?.trend === 'declining' && (
                <div className="flex items-start space-x-2">
                  <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <p>Your focus is declining. Consider shorter sessions or eliminating distractions.</p>
                </div>
              )}
              {state.insights.length > 0 && (
                <div className="flex items-start space-x-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <p>Try avoiding the {formatHour(state.insights[state.insights.length - 1].hour)} hour when your focus is typically lower.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;