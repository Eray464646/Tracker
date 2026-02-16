const CACHE_NAME = 'habitflow-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/habits',
  '/planner',
  '/settings',
  '/globals.css',
  '/manifest.json',
];

const WATER_REMINDER_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches and start background sync
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim(),
    ])
  );
  
  // Start periodic background sync for water reminders
  if ('periodicSync' in self.registration) {
    self.registration.periodicSync.register('water-reminder-check', {
      minInterval: 60 * 60 * 1000, // Check every hour
    }).catch((err) => {
      console.log('Periodic sync not available or registration failed:', err);
      // Fallback: Use regular sync API if available
      if ('sync' in self.registration) {
        console.log('Using regular sync API as fallback');
      }
    });
  }
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      // Fallback for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/');
      }
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from HabitFlow',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'habitflow-notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification('HabitFlow', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Periodic sync event for water reminders
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'water-reminder-check') {
    event.waitUntil(checkWaterReminder());
  }
});

// Background sync for water reminders
self.addEventListener('sync', (event) => {
  if (event.tag === 'water-reminder') {
    event.waitUntil(checkWaterReminder());
  }
});

// Check if water reminder should be sent
async function checkWaterReminder() {
  try {
    // Get last water intake time from clients
    const allClients = await clients.matchAll({
      includeUncontrolled: true,
      type: 'window',
    });

    // If no clients are open, check localStorage through message
    if (allClients.length === 0) {
      // Show notification if needed (we can't access localStorage from SW without a client)
      // So we'll just show a generic reminder
      const now = new Date();
      const hours = now.getHours();
      
      // Only send during waking hours (8 AM - 10 PM)
      if (hours >= 8 && hours <= 22) {
        await self.registration.showNotification('HabitFlow Wassererinnerung', {
          body: 'Zeit für ein Glas Wasser! 💧',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          tag: 'water-reminder',
          requireInteraction: false,
          vibrate: [200, 100, 200],
        });
      }
    } else {
      // Ask client for last water intake time
      for (const client of allClients) {
        client.postMessage({
          type: 'CHECK_WATER_REMINDER',
        });
      }
    }
  } catch (error) {
    console.error('Error checking water reminder:', error);
  }
}

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'WATER_INTAKE_UPDATE') {
    // Client updated water intake, reset reminder timer
    const lastIntakeTime = event.data.timestamp;
    
    // Schedule next check
    if ('setTimeout' in self) {
      setTimeout(() => {
        checkWaterReminder();
      }, WATER_REMINDER_INTERVAL);
    }
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
