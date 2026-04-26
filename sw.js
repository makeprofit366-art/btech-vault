// BTechVault Service Worker v1.0
const CACHE_NAME = 'btechvault-v1';
const OFFLINE_PAGE = '/index.html';

// Files to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/login.html',
  '/chat.html',
  '/resume-builder.html',
  '/firebase-config.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// ── INSTALL: cache core files ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('Some files failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: clean old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: network first, fallback to cache ──
self.addEventListener('fetch', event => {
  // Skip non-GET and Firebase/CDN requests
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('corsproxy.io') ||
    url.hostname.includes('cdnjs.cloudflare.com')
  ) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // For navigation requests, return index
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_PAGE);
          }
        });
      })
  );
});

// ── PUSH NOTIFICATIONS (future use) ──
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'BTechVault', {
      body: data.body || 'New study material uploaded!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
