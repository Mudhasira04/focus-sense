import React from 'react';
import { AppProvider } from './contexts/AppContext';
import Timer from './components/Timer';
import History from './components/History';
import Insights from './components/Insights';
import { Timer as TimerIcon, History as HistoryIcon, TrendingUp, Moon, Sun } from 'lucide-react';
import { useApp } from './contexts/AppContext';

const AppContent: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = React.useState('timer');

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return <Timer />;
      case 'history':
        return <History />;
      case 'insights':
        return <Insights />;
      default:
        return <Timer />;
    }
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen shadow-xl">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Focus Sense</h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {state.isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>
        
        <main className="flex-1 pb-20">
          {renderContent()}
        </main>
        
        <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-around py-2">
            <button
              onClick={() => setActiveTab('timer')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'timer' 
                  ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <TimerIcon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Timer</span>
            </button>
            
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'history' 
                  ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <HistoryIcon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">History</span>
            </button>
            
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'insights' 
                  ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <TrendingUp className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Insights</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;