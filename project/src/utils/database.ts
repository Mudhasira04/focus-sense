import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { FocusSession } from '../types';

class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private isNative: boolean;
  private isInitialized: boolean = false;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    if (this.isNative) {
      this.sqlite = new SQLiteConnection(CapacitorSQLite);
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      if (this.isNative) {
        await this.initializeSQLite();
      } else {
        await this.initializeIndexedDB();
      }
      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      // Fallback to localStorage for web if IndexedDB fails
      if (!this.isNative) {
        console.log('Falling back to localStorage');
      }
    }
  }

  private async initializeSQLite(): Promise<void> {
    try {
      if (!this.sqlite) {
        throw new Error('SQLite not available on this platform');
      }
      
      // Check if connection exists
      const isConnection = await this.sqlite.isConnection('focussense', false);
      if (isConnection.result) {
        this.db = await this.sqlite.retrieveConnection('focussense', false);
      } else {
        this.db = await this.sqlite.createConnection('focussense', false, 'no-encryption', 1, false);
      }
      
      await this.db.open();
      
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS focus_sessions (
          id TEXT PRIMARY KEY,
          startTime TEXT NOT NULL,
          endTime TEXT,
          duration INTEGER NOT NULL,
          distractions INTEGER NOT NULL,
          isCompleted INTEGER NOT NULL,
          targetDuration INTEGER NOT NULL
        );
      `;
      
      await this.db.execute(createTableQuery);
      console.log('SQLite database initialized');
    } catch (error) {
      console.error('SQLite initialization failed:', error);
      throw error;
    }
  }

  private async initializeIndexedDB(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('FocusSenseDB', 1);
      
      request.onerror = () => {
        console.error('IndexedDB initialization failed:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log('IndexedDB initialized successfully');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('focus_sessions')) {
          const store = db.createObjectStore('focus_sessions', { keyPath: 'id' });
          store.createIndex('startTime', 'startTime', { unique: false });
          console.log('IndexedDB object store created');
        }
      };
    });
  }

  async saveSession(session: FocusSession): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      if (this.isNative && this.db) {
        const query = `
          INSERT OR REPLACE INTO focus_sessions 
          (id, startTime, endTime, duration, distractions, isCompleted, targetDuration)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        await this.db.run(query, [
          session.id,
          session.startTime.toISOString(),
          session.endTime?.toISOString() || null,
          session.duration,
          session.distractions,
          session.isCompleted ? 1 : 0,
          session.targetDuration
        ]);
        console.log('Session saved to SQLite:', session.id);
      } else {
        // IndexedDB for web
        return new Promise((resolve, reject) => {
          const request = indexedDB.open('FocusSenseDB', 1);
          request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['focus_sessions'], 'readwrite');
            const store = transaction.objectStore('focus_sessions');
            
            const sessionData = {
              ...session,
              startTime: session.startTime.toISOString(),
              endTime: session.endTime?.toISOString() || null
            };
            
            const putRequest = store.put(sessionData);
            putRequest.onsuccess = () => {
              console.log('Session saved to IndexedDB:', session.id);
              resolve();
            };
            putRequest.onerror = () => reject(putRequest.error);
          };
          request.onerror = () => {
            // Fallback to localStorage
            this.saveToLocalStorage(session);
            resolve();
          };
        });
      }
    } catch (error) {
      console.error('Failed to save session:', error);
      // Fallback to localStorage for web
      if (!this.isNative) {
        this.saveToLocalStorage(session);
      }
    }
  }

  private saveToLocalStorage(session: FocusSession): void {
    try {
      const existingSessions = this.getFromLocalStorage();
      const updatedSessions = [session, ...existingSessions.filter(s => s.id !== session.id)];
      localStorage.setItem('focus_sessions', JSON.stringify(updatedSessions));
      console.log('Session saved to localStorage:', session.id);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private getFromLocalStorage(): FocusSession[] {
    try {
      const data = localStorage.getItem('focus_sessions');
      if (data) {
        const sessions = JSON.parse(data);
        return sessions.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : null
        }));
      }
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
    }
    return [];
  }

  async getSessions(): Promise<FocusSession[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      if (this.isNative && this.db) {
        const result = await this.db.query('SELECT * FROM focus_sessions ORDER BY startTime DESC');
        const sessions = result.values?.map(row => ({
          id: row.id,
          startTime: new Date(row.startTime),
          endTime: row.endTime ? new Date(row.endTime) : null,
          duration: row.duration,
          distractions: row.distractions,
          isCompleted: row.isCompleted === 1,
          targetDuration: row.targetDuration
        })) || [];
        console.log('Loaded sessions from SQLite:', sessions.length);
        return sessions;
      } else {
        // IndexedDB for web
        return new Promise((resolve, reject) => {
          const request = indexedDB.open('FocusSenseDB', 1);
          request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['focus_sessions'], 'readonly');
            const store = transaction.objectStore('focus_sessions');
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => {
              const sessions = getAllRequest.result.map((session: any) => ({
                ...session,
                startTime: new Date(session.startTime),
                endTime: session.endTime ? new Date(session.endTime) : null
              }));
              const sortedSessions = sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
              console.log('Loaded sessions from IndexedDB:', sortedSessions.length);
              resolve(sortedSessions);
            };
            
            getAllRequest.onerror = () => reject(getAllRequest.error);
          };
          
          request.onerror = () => {
            // Fallback to localStorage
            console.log('IndexedDB failed, using localStorage');
            const sessions = this.getFromLocalStorage();
            resolve(sessions);
          };
        });
      }
    } catch (error) {
      console.error('Failed to get sessions:', error);
      // Fallback to localStorage for web
      if (!this.isNative) {
        return this.getFromLocalStorage();
      }
      return [];
    }
  }

  async clearAllSessions(): Promise<void> {
    try {
      if (this.isNative && this.db) {
        await this.db.execute('DELETE FROM focus_sessions');
      } else {
        const request = indexedDB.open('FocusSenseDB', 1);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['focus_sessions'], 'readwrite');
          const store = transaction.objectStore('focus_sessions');
          store.clear();
        };
        // Also clear localStorage
        localStorage.removeItem('focus_sessions');
      }
      console.log('All sessions cleared');
    } catch (error) {
      console.error('Failed to clear sessions:', error);
    }
  }
}

export const databaseService = new DatabaseService();