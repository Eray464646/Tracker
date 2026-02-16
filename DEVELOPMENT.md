# HabitFlow - Development Guide

## Project Overview

HabitFlow is a Progressive Web App (PWA) for tracking habits, tasks, and schedules. It's built following Apple Design Guidelines to feel like a native iOS app.

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation
```bash
npm install
```

### Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard (Today view)
│   ├── habits/            # Habit tracker
│   ├── planner/           # Calendar and event planner
│   ├── settings/          # App settings
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Root redirect to dashboard
│   └── globals.css        # Global styles with iOS fixes
├── components/            # Reusable React components
│   └── BottomNav.tsx      # iOS-style bottom navigation
├── lib/                   # Utility functions (future)
├── public/
│   ├── icons/             # PWA icons and assets
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service Worker
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## Key Technologies

### Next.js App Router
- Server Components by default
- Client Components with 'use client' directive
- File-based routing
- Built-in API routes (future)

### Tailwind CSS
- Utility-first CSS framework
- Custom iOS-style utilities (see globals.css)
- Custom color palette matching iOS design

### Framer Motion
- Declarative animations
- Layout animations for smooth transitions
- Gesture support (tap, drag, etc.)

### Radix UI
- Accessible, unstyled component primitives
- Dialog, Select, Tabs, Progress components
- Future: More complex UI patterns

## iOS-Specific Styling

### Preventing Pull-to-Refresh
```css
html, body {
  overscroll-behavior-y: contain;
  overflow: hidden;
  position: fixed;
}
```

### Safe Area Support
```css
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### iOS Tap Highlight
```css
* {
  -webkit-tap-highlight-color: transparent;
}
```

## Data Storage

### Current: LocalStorage
- Simple key-value storage
- Synchronous API
- Limited to ~5-10MB
- Used for habits, tasks, settings

### Future: IndexedDB
- Asynchronous API
- Much larger storage limit
- Better for complex queries
- Recommended for production

## Service Worker

The Service Worker (`/public/sw.js`) provides:
- Offline caching of static assets
- Network-first strategy for API calls
- Push notification support
- Background sync (future)

## PWA Features

### Manifest Configuration
Located in `/public/manifest.json`:
- App name and description
- Icons for various sizes
- Display mode: standalone
- Theme color: iOS blue (#007AFF)
- Orientation: portrait

### Installation Flow
1. User visits site in Safari
2. Service Worker registers
3. Manifest is recognized
4. "Add to Home Screen" available
5. Icon appears on home screen
6. Opens in standalone mode

## Animation Patterns

### Page Transitions
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
  {/* Content */}
</motion.div>
```

### List Items
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    {/* Item content */}
  </motion.div>
))}
```

### Button Tap
```tsx
<motion.button
  whileTap={{ scale: 0.9 }}
  className="ios-button"
>
  Click me
</motion.button>
```

## Color System

### Primary (iOS Blue)
- 50: #E6F2FF
- 500: #007AFF (main)
- 900: #001833

### Success (iOS Green)
- 500: #34C759

### Gray Scale
- 50: #F2F2F7 (background)
- 900: #1C1C1E (text)

## Best Practices

### Performance
- Use `React.memo()` for expensive components
- Implement virtualization for long lists
- Lazy load images
- Code splitting with dynamic imports

### Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast ratios

### Mobile Optimization
- Touch targets min 44x44px
- Prevent accidental zooms
- Use 16px minimum font size
- Test on actual iOS devices

## Testing

### Manual Testing Checklist
- [ ] Install as PWA on iPhone
- [ ] Test offline mode
- [ ] Check all navigation works
- [ ] Verify animations are smooth
- [ ] Test pull-to-refresh is disabled
- [ ] Check safe area insets
- [ ] Verify localStorage persistence

### Future: Automated Testing
- Jest for unit tests
- React Testing Library for components
- Playwright for E2E tests
- Lighthouse for PWA audit

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- Netlify
- Cloudflare Pages
- AWS Amplify
- Self-hosted with PM2

## Troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node -v` (should be 18+)

### PWA Not Installing
- Check manifest.json is accessible
- Verify Service Worker registers
- Ensure HTTPS in production
- Check Safari console for errors

### Styling Issues
- Run Tailwind rebuild: `npm run dev`
- Check PostCSS config
- Verify Tailwind config paths

## Contributing

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Adding New Features
1. Create feature branch
2. Implement with tests
3. Update documentation
4. Submit pull request
5. Request code review

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
