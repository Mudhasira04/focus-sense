import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.focussense.app',
  appName: 'Focus Sense',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SQLite: {
      iosDatabaseLocation: 'default'
    }
  }
};

export default config;