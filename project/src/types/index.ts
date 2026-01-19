export interface FocusSession {
  id: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in seconds
  distractions: number;
  isCompleted: boolean;
  targetDuration: number; // in seconds
}

export interface TimeWindow {
  hour: number;
  averageDuration: number;
  averageDistractions: number;
  sessionCount: number;
  score: number;
}

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  currentSession: FocusSession | null;
  targetDuration: number;
}