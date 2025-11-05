const CACHE_NAME = 'overseas-ai-v1';
const urlsToCache = [
  '/',
  '/images/institute.png',
  '/images/overseas.ainewlogo.png',
  '/images/brandlogo.gif',
];

// Cache API responses for these endpoints (excluding pagination-sensitive endpoints)
const API_CACHE_PATTERNS = [
  'https://backend.overseas.ai/api/get-occupations',
  'https://backend.overseas.ai/api/country-list-for-jobs',
  'https://backend.overseas.ai/api/country-list',
];

// Don't cache these endpoints as they need to be fresh
const NO_CACHE_PATTERNS = [
  'get-job-list',
  'apply-job',
  'save-job',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // Add files one by one with error handling
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              return null;
            })
          )
        );
      })
  );
});

self.addEventListener('fetch', function(event) {
  const requestUrl = event.request.url;
  
  // Don't cache pagination and job interaction endpoints
  if (NO_CACHE_PATTERNS.some(pattern => requestUrl.includes(pattern))) {
    // Just fetch without caching
    event.respondWith(fetch(event.request));
    return;
  }
  
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
