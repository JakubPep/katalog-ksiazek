const CACHE_NAME = 'book-catalog-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
];

// Instalacja Service Workera
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_URLS))
  );
});

// Przechwytywanie zapytań sieciowych
self.addEventListener('fetch', (event) => {
  // Strategia Cache First dla zasobów statycznych
  if (event.request.url.includes('/static/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }

  // Strategia Network First dla API
  if (event.request.url.includes('googleapis.com')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache API response
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback do cache
          return caches.match(event.request);
        })
    );
  }
});

// Czyszczenie starych cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
