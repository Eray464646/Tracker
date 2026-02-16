import type { Metadata, Viewport } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'HabitFlow',
  description: 'Verfolge deine Gewohnheiten, Nahrungsergänzungen und tägliche Aufgaben',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HabitFlow',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#007AFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-title" content="HabitFlow" />
      </head>
      <body className="antialiased">
        <div className="flex flex-col h-full max-w-[430px] w-full mx-auto bg-gray-50 dark:bg-black">
          <main className="flex-1 overflow-y-auto pb-20">
            {children}
          </main>
          <BottomNav />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Apply dark mode before page renders to prevent flash
              // NOTE: This logic is intentionally duplicated from settings page
              // to ensure dark mode is applied before any React rendering occurs
              (function() {
                const savedMode = localStorage.getItem('dark-mode');
                const html = document.documentElement;
                
                if (savedMode === 'dark') {
                  html.classList.add('dark');
                } else if (savedMode === 'light') {
                  html.classList.remove('dark');
                } else {
                  // Auto mode or not set - follow system preference
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    html.classList.add('dark');
                  }
                }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                      console.log('SW registered: ', registration);
                    },
                    (err) => {
                      console.log('SW registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
