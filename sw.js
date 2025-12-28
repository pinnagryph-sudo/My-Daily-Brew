// Service Worker for My Daily Brew PWA
// Version-based caching for easy updates
const CACHE_VERSION = 'v7.0.0';
const CACHE_NAME = `daily-brew-${CACHE_VERSION}`;

// Assets to cache for offline use
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/favicon.ico',
  './icons/apple-touch-icon.png',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png'
];

// Sound files - cached on first use (not precached due to size)
const SOUND_FILES = [
  './sounds/cafe-contemplations.mp3',
  './sounds/elegant-background.mp3',
  './sounds/tea-time-piano.mp3',
  './sounds/minimal-lofi.mp3',
  './sounds/zen-garden.mp3',
  './sounds/japanese-lofi.mp3',
  './sounds/fireplace.mp3',
  './sounds/rain.mp3',
  './sounds/wind.mp3',
  './sounds/ocean.mp3'
];

// External resources to cache
const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Lora:wght@400;500;600&display=swap',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

// Scheduled notifications storage (in-memory, will be lost on SW restart)
// Main scheduling happens in the main thread; this is for background checks
let scheduledNotifications = {};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        // Cache static assets first
        return cache.addAll(STATIC_ASSETS)
          .then(() => {
            // Try to cache external assets, but don't fail if they're unavailable
            return Promise.allSettled(
              EXTERNAL_ASSETS.map(url => 
                cache.add(url).catch(err => console.log('[SW] Failed to cache:', url))
              )
            );
          });
      })
      .then(() => {
        console.log('[SW] Installation complete');
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('daily-brew-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          // For HTML, use stale-while-revalidate
          if (request.headers.get('accept')?.includes('text/html')) {
            // Fetch in background to update cache
            fetch(request)
              .then((networkResponse) => {
                if (networkResponse.ok) {
                  caches.open(CACHE_NAME)
                    .then((cache) => cache.put(request, networkResponse));
                }
              })
              .catch(() => {});
          }
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            // Clone the response for caching
            const responseToCache = networkResponse.clone();
            
            // Cache the fetched response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.log('[SW] Fetch failed:', error);
            
            // Return offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            
            throw error;
          });
      })
  );
});

// Message event - handle various commands from main thread
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      console.log('[SW] Skip waiting requested');
      self.skipWaiting();
      break;
      
    case 'SCHEDULE_NOTIFICATION':
      console.log('[SW] Scheduling notification:', payload);
      if (payload && payload.taskId) {
        scheduledNotifications[payload.taskId] = payload;
      }
      break;
      
    case 'CANCEL_NOTIFICATION':
      console.log('[SW] Cancelling notification:', payload);
      if (payload && payload.taskId) {
        delete scheduledNotifications[payload.taskId];
      }
      break;
      
    case 'CHECK_NOTIFICATIONS':
      // Check if any notifications should fire
      checkScheduledNotifications();
      break;
  }
});

// Check scheduled notifications
function checkScheduledNotifications() {
  const now = Date.now();
  
  Object.entries(scheduledNotifications).forEach(([taskId, reminder]) => {
    if (reminder.notifyAt <= now) {
      // Time to show notification
      showTaskNotification(reminder);
      delete scheduledNotifications[taskId];
    }
  });
}

// Show a task notification
async function showTaskNotification(reminder) {
  const priorityEmoji = {
    high: '🔴',
    medium: '🟡', 
    low: '🟢'
  };
  
  const emoji = priorityEmoji[reminder.priority] || '📌';
  
  try {
    await self.registration.showNotification('☕ Daily Brew Reminder', {
      body: `${emoji} ${reminder.taskText}`,
      icon: 'icons/icon-192.png',
      badge: 'icons/icon-96.png',
      tag: `task-${reminder.taskId}`,
      renotify: true,
      requireInteraction: true, // Stay on screen until dismissed
      vibrate: [200, 100, 200, 100, 200], // Vibration pattern
      actions: [
        { action: 'complete', title: '✓ Done' },
        { action: 'snooze', title: '⏰ +10 min' }
      ],
      data: {
        taskId: reminder.taskId,
        taskText: reminder.taskText,
        priority: reminder.priority,
        time: reminder.time
      }
    });
    console.log('[SW] Notification shown for task:', reminder.taskId);
  } catch (error) {
    console.error('[SW] Failed to show notification:', error);
  }
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};
  
  console.log('[SW] Notification clicked:', action, data);
  
  notification.close();
  
  event.waitUntil(
    (async () => {
      // Get all clients
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      
      if (action === 'complete') {
        // Mark task as complete
        if (clients.length > 0) {
          // Send message to client
          clients[0].postMessage({
            type: 'NOTIFICATION_ACTION',
            payload: { action: 'complete', taskId: data.taskId }
          });
          clients[0].focus();
        } else {
          // Open app with action parameter
          await self.clients.openWindow(`./index.html?action=complete&taskId=${data.taskId}`);
        }
      } else if (action === 'snooze') {
        // Snooze for 10 minutes
        const snoozeTime = Date.now() + (10 * 60 * 1000);
        
        scheduledNotifications[data.taskId] = {
          ...data,
          notifyAt: snoozeTime
        };
        
        // Set timeout for snooze
        setTimeout(() => {
          showTaskNotification(scheduledNotifications[data.taskId]);
          delete scheduledNotifications[data.taskId];
        }, 10 * 60 * 1000);
        
        // Notify user of snooze
        await self.registration.showNotification('☕ Snoozed', {
          body: `I'll remind you about "${data.taskText}" in 10 minutes`,
          icon: 'icons/icon-192.png',
          badge: 'icons/icon-96.png',
          tag: 'snooze-confirmation',
          silent: true // Don't make sound for confirmation
        });
        
        if (clients.length > 0) {
          clients[0].postMessage({
            type: 'NOTIFICATION_ACTION',
            payload: { action: 'snooze', taskId: data.taskId, snoozeUntil: snoozeTime }
          });
        }
      } else {
        // Default click - open app
        if (clients.length > 0) {
          clients[0].focus();
        } else {
          await self.clients.openWindow('./');
        }
      }
    })()
  );
});

// Handle notification close (without action)
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event.notification.tag);
});

// Periodic background sync (if supported) - for checking notifications
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkScheduledNotifications());
  }
});

// Regular background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(checkScheduledNotifications());
  }
});

// Push event (for future server-based notifications)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title || '☕ Daily Brew', {
        body: data.body || 'You have a reminder',
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-96.png',
        data: data.data || {}
      })
    );
  } catch (error) {
    console.error('[SW] Push event error:', error);
  }
});
