import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { FocusSession, TimerState, TimeWindow } from '../types';
import { databaseService } from '../utils/database';

interface AppState {
  timer: TimerState;
  sessions: FocusSession[];
  insights: TimeWindow[];
  isLoading: boolean;
  isDarkMode: boolean;
}

type AppAction = 
  | { type: 'START_TIMER'; payload: number }
  | { type: 'STOP_TIMER' }
  | { type: 'TICK' }
  | { type: 'ADD_DISTRACTION' }
  | { type: 'SET_SESSIONS'; payload: FocusSession[] }
  | { type: 'ADD_SESSION'; payload: FocusSession }
  | { type: 'SET_INSIGHTS'; payload: TimeWindow[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_THEME' };

const initialState: AppState = {
  timer: {
    isRunning: false,
    timeLeft: 25 * 60, // 25 minutes default
    currentSession: null,
    targetDuration: 25 * 60
  },
  sessions: [],
  insights: [],
  isLoading: true,
  isDarkMode: false
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'START_TIMER':
      const newSession: FocusSession = {
        id: Date.now().toString(),
        startTime: new Date(),
        endTime: null,
        duration: 0,
        distractions: 0,
        isCompleted: false,
        targetDuration: action.payload
      };
      
      return {
        ...state,
        timer: {
          isRunning: true,
          timeLeft: action.payload,
          currentSession: newSession,
          targetDuration: action.payload
        }
      };
      
    case 'STOP_TIMER':
      if (state.timer.currentSession) {
        const completedSession: FocusSession = {
          ...state.timer.currentSession,
          endTime: new Date(),
          duration: state.timer.targetDuration - state.timer.timeLeft,
          isCompleted: state.timer.timeLeft === 0
        };
        
        return {
          ...state,
          timer: {
            isRunning: false,
            timeLeft: state.timer.targetDuration,
            currentSession: null,
            targetDuration: state.timer.targetDuration
          },
          sessions: [completedSession, ...state.sessions]
        };
      }
      return state;
      
    case 'TICK':
      if (state.timer.timeLeft <= 1) {
        // Timer completed
        if (state.timer.currentSession) {
          const completedSession: FocusSession = {
            ...state.timer.currentSession,
            endTime: new Date(),
            duration: state.timer.targetDuration,
            isCompleted: true
          };
          
          return {
            ...state,
            timer: {
              isRunning: false,
              timeLeft: 0,
              currentSession: null,
              targetDuration: state.timer.targetDuration
            },
            sessions: [completedSession, ...state.sessions]
          };
        }
      }
      
      return {
        ...state,
        timer: {
          ...state.timer,
          timeLeft: Math.max(0, state.timer.timeLeft - 1)
        }
      };
      
    case 'ADD_DISTRACTION':
      if (state.timer.currentSession) {
        return {
          ...state,
          timer: {
            ...state.timer,
            currentSession: {
              ...state.timer.currentSession,
              distractions: state.timer.currentSession.distractions + 1
            }
          }
        };
      }
      return state;
      
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
      
    case 'ADD_SESSION':
      return { ...state, sessions: [action.payload, ...state.sessions] };
      
    case 'SET_INSIGHTS':
      return { ...state, insights: action.payload };
      
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'TOGGLE_THEME':
      const newDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
      return { ...state, isDarkMode: newDarkMode };
      
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load theme preference on app start
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      const isDarkMode = JSON.parse(savedTheme);
      if (isDarkMode) {
        dispatch({ type: 'TOGGLE_THEME' });
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  // Initialize database and load sessions
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await databaseService.initialize();
        const sessions = await databaseService.getSessions();
        dispatch({ type: 'SET_SESSIONS', payload: sessions });
        console.log('App initialized with', sessions.length, 'sessions');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    initializeApp();
  }, []);

  useEffect(() => {
    if (state.timer.isRunning) {
      const interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [state.timer.isRunning]);

  useEffect(() => {
    // Save sessions to database when they change
    const saveLatestSession = async () => {
      const latestSession = state.sessions[0];
      if (latestSession && latestSession.endTime && !state.isLoading) {
        try {
          await databaseService.saveSession(latestSession);
          console.log('Session saved:', latestSession.id);
        } catch (error) {
          console.error('Failed to save session:', error);
        }
      }
    };
    
    if (!state.isLoading && state.sessions.length > 0) {
      saveLatestSession();
    }
  }, [state.sessions, state.isLoading]);

  useEffect(() => {
    // Calculate insights when sessions change
    const calculateInsights = () => {
      const insights = analyzeTimeWindows(state.sessions);
      dispatch({ type: 'SET_INSIGHTS', payload: insights });
    };
    
    if (state.sessions.length > 0) {
      calculateInsights();
    }
  }, [state.sessions]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Helper function to analyze time windows
function analyzeTimeWindows(sessions: FocusSession[]): TimeWindow[] {
  const hourlyData: { [hour: number]: { durations: number[], distractions: number[] } } = {};
  
  sessions.filter(s => s.isCompleted).forEach(session => {
    const hour = session.startTime.getHours();
    if (!hourlyData[hour]) {
      hourlyData[hour] = { durations: [], distractions: [] };
    }
    hourlyData[hour].durations.push(session.duration);
    hourlyData[hour].distractions.push(session.distractions);
  });
  
  return Object.entries(hourlyData).map(([hour, data]) => {
    const avgDuration = data.durations.reduce((a, b) => a + b, 0) / data.durations.length;
    const avgDistractions = data.distractions.reduce((a, b) => a + b, 0) / data.distractions.length;
    const sessionCount = data.durations.length;
    
    // Score based on duration and low distractions
    const score = (avgDuration / 60) * (1 / (avgDistractions + 1)) * sessionCount;
    
    return {
      hour: parseInt(hour),
      averageDuration: avgDuration,
      averageDistractions: avgDistractions,
      sessionCount,
      score
    };
  }).sort((a, b) => b.score - a.score);
}