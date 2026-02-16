# HabitFlow - iOS-Style PWA Habit Tracker

A Progressive Web App built with Next.js that helps you track habits, supplements, and daily tasks with an Apple Health-inspired design.

## Features

- 📱 **iOS-Style Design**: Follows Apple Design Guidelines with large titles, rounded cards, and native animations
- 🎯 **Habit Tracking**: Create and track daily/weekly habits with streak counters
- 📅 **Day Planner**: Schedule events and tasks with calendar integration
- 💧 **Water Tracker**: Track your water intake (coming soon)
- 💊 **Supplement Tracker**: Track dietary supplements (coming soon)
- 📴 **Offline Support**: Works offline with Service Worker
- 🔔 **Push Notifications**: Get reminders for habits (iOS 16.4+)
- 📥 **Export to Calendar**: Export events as .ics files for iOS Calendar

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom iOS-style utilities
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Data Storage**: LocalStorage (IndexedDB coming soon)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## PWA Installation

### On iOS (Safari)

1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

The app will now open in standalone mode without Safari's UI chrome.

## Project Structure

```
├── app/
│   ├── dashboard/      # Today's overview
│   ├── habits/         # Habit tracker
│   ├── planner/        # Calendar and events
│   ├── settings/       # App settings
│   ├── layout.tsx      # Root layout with bottom nav
│   └── globals.css     # Global styles with iOS fixes
├── components/
│   └── BottomNav.tsx   # iOS-style bottom navigation
├── public/
│   ├── manifest.json   # PWA manifest
│   ├── sw.js          # Service Worker
│   └── icons/         # App icons
└── lib/               # Utilities (coming soon)
```

## iOS-Specific Features

- **No Pull-to-Refresh**: Prevents the default iOS pull-to-refresh behavior
- **No Rubber Banding**: Prevents overscroll bounce effect
- **Safe Area Support**: Respects iPhone notch and home indicator
- **Touch Optimized**: Native-feeling tap interactions and animations
- **SF Pro Font**: Uses system font for authenticity

## License

MIT