const CACHE_NAME = 'overseas-ai-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/images/institute.png',
];

// Cache API responses for these endpoints
const API_CACHE_PATTERNS = [
  'https://backend.overseas.ai/api/get-occupations',
  'https://backend.overseas.ai/api/country-list-for-jobs',
  'https://backend.overseas.ai/api/country-list',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  const requestUrl = event.request.url;
  
  // Cache API responses for 10 minutes
  if (API_CACHE_PATTERNS.some(pattern => requestUrl.includes(pattern))) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          // Check if cache is still valid (10 minutes)
          const cachedTime = new Date(response.headers.get('date')).getTime();
          const now = new Date().getTime();
          const tenMinutes = 10 * 60 * 1000;
          
          if (now - cachedTime < tenMinutes) {
            return response;
          }
        }
        
        // Fetch fresh data and cache it
        return fetch(event.request).then(function(response) {
          if (!response || response.status !== 200 || response.type !== 'cors') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        }).catch(function() {
          // Return cached version if network fails
          return caches.match(event.request);
        });
      })
    );
    return;
  }
  
  // Default caching strategy for other resources
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version if available
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
