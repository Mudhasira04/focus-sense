import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Timer, History, TrendingUp } from 'lucide-react';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Focus Sense</h1>
        </header>
        
        <main className="flex-1 pb-20">
          <Outlet />
        </main>
        
        <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
          <div className="flex justify-around py-2">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800'
                }`
              }
            >
              <Timer className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Timer</span>
            </NavLink>
            
            <NavLink
              to="/history"
              className={({ isActive }) => 
                `flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800'
                }`
              }
            >
              <History className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">History</span>
            </NavLink>
            
            <NavLink
              to="/insights"
              className={({ isActive }) => 
                `flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800'
                }`
              }
            >
              <TrendingUp className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Insights</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;