# Focus Sense - Cross-Platform Pomodoro App

A beautiful, minimalist Pomodoro timer app built with React, Vite, and Capacitor for web and Android platforms.

## 🚀 Features

- **Customizable Pomodoro Timer**: Choose from 15, 25, 30, 45, or 60-minute focus sessions
- **Distraction Tracking**: Log distractions during sessions with a simple tap
- **Session History**: View detailed history of all focus sessions with completion rates
- **Smart Insights**: AI-powered analysis to predict your best focus time windows
- **Cross-Platform**: Runs on web browsers and Android devices
- **Local Storage**: Data stored locally using SQLite (Android) or IndexedDB (web)
- **Beautiful UI**: Clean, modern design with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router
- **Mobile**: Capacitor
- **Database**: SQLite (Android) + IndexedDB (Web)
- **State Management**: React Context + useReducer

## 📱 Installation & Setup

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Android Studio (for Android builds)
- Java Development Kit (JDK) 11+

### Web Development

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo>
   cd focus-sense
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**: Navigate to `http://localhost:5173`

### Android Build

1. **Build the web assets**:
   ```bash
   npm run build
   ```

2. **Initialize Capacitor**:
   ```bash
   npx cap init
   ```

3. **Add Android platform**:
   ```bash
   npx cap add android
   ```

4. **Sync changes**:
   ```bash
   npx cap sync android
   ```

5. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

6. **Build and run**:
   - Connect an Android device or start an emulator
   - In Android Studio, click the "Run" button or press `Shift+F10`

### Building APK

1. **In Android Studio**:
   - Go to `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - The APK will be generated in `android/app/build/outputs/apk/debug/`

2. **Command line alternative**:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

## 📊 App Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx      # App layout with navigation
│   ├── Timer.tsx       # Pomodoro timer interface
│   ├── History.tsx     # Session history view
│   └── Insights.tsx    # Analytics and insights
├── contexts/           # React Context providers
│   └── AppContext.tsx  # Global state management
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions
│   └── database.ts    # Database abstraction layer
└── App.tsx            # Main app component
```

## 🔄 Data Flow

1. **Timer Component**: Manages focus sessions and user interactions
2. **App Context**: Centralizes state management using useReducer
3. **Database Service**: Abstracts storage (SQLite for Android, IndexedDB for web)
4. **Analytics Engine**: Processes session data to generate insights

## 📈 Features Detail

### Pomodoro Timer
- Select from predefined durations (15-60 minutes)
- Visual progress indicator with circular timer
- Start/stop functionality with session persistence

### Session Tracking
- Automatic recording of start/end times
- Manual distraction logging during active sessions
- Completion rate calculation

### Smart Insights
- Analyzes historical data to find optimal focus times
- Productivity trend analysis
- Personalized recommendations based on session patterns

### Cross-Platform Storage
- **Android**: SQLite database via Capacitor SQLite plugin
- **Web**: IndexedDB with automatic fallback
- Seamless data synchronization across platforms

## 🎨 Design Philosophy

- **Minimalism**: Clean interface to reduce cognitive load during focus sessions
- **Accessibility**: High contrast colors and clear typography
- **Responsiveness**: Optimized for both mobile and desktop experiences
- **Performance**: Lightweight and fast with smooth animations

## 🔧 Customization

### Adding New Timer Durations
Edit the `durations` array in `src/components/Timer.tsx`:

```typescript
const durations = [15, 25, 30, 45, 60, 90]; // Add 90 minutes
```

### Modifying Analytics Algorithm
Update the `analyzeTimeWindows` function in `src/contexts/AppContext.tsx` to change how insights are calculated.

### Styling Changes
All styles use Tailwind CSS classes. Modify the `tailwind.config.js` file to customize colors, spacing, etc.

## 🚀 Deployment

### Web Deployment
```bash
npm run build
# Deploy the 'dist' folder to your web server
```

### Android Release
1. Generate a signed APK in Android Studio
2. Upload to Google Play Store or distribute directly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🐛 Troubleshooting

### Common Issues

1. **Android build fails**: Ensure Android Studio and JDK are properly installed
2. **SQLite plugin errors**: Run `npx cap sync android` after adding the plugin
3. **Web storage issues**: Check browser console for IndexedDB errors
4. **Timer not working**: Verify JavaScript is enabled and check for console errors

### Getting Help

- Check the GitHub issues for known problems
- Review Capacitor documentation for platform-specific issues
- Ensure all dependencies are up to date

---

Built with ❤️ using React, Vite, and Capacitor.