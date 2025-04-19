// Enhanced Service Worker for PWA Support
const CACHE_NAME = 'floor-plan-cache-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// Runtime cache for dynamic assets
const RUNTIME_CACHE = [
  /\.(?:js|css|woff2)$/,
  /\/api\//
];

// Cache max age for dynamic assets (1 week)
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// Install event handler
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Pre-caching application assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
  );
});

// Activate event handler
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Delete old caches
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('[ServiceWorker] Removing old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Ensure the service worker takes control immediately
      return self.clients.claim();
    })
  );
});

// Helper function to determine if a request should be cached
function shouldCache(url) {
  // Check URL against runtime cache patterns
  return RUNTIME_CACHE.some(pattern => {
    return typeof pattern === 'string' ? url.includes(pattern) : pattern.test(url);
  });
}

// Fetch event handler
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Network-first strategy for API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response for caching
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Cache-first strategy for static assets
  if (event.request.method === 'GET' && shouldCache(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Check if cache is still valid
            const cachedDate = new Date(cachedResponse.headers.get('date'));
            if (Date.now() - cachedDate.getTime() < CACHE_MAX_AGE) {
              return cachedResponse;
            }
          }
          
          // Fetch from network if not cached or expired
          return fetch(event.request)
            .then(response => {
              // Clone the response for caching
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            })
            .catch(error => {
              // If both cache and network fail, return a fallback
              console.error('[ServiceWorker] Fetch failed:', error);
              
              // Return fallback for image requests
              if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
                return caches.match('/assets/offline-image.png');
              }
              
              // If HTML request failed, show offline page
              if (event.request.headers.get('Accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
              
              // Otherwise just fail
              throw error;
            });
        })
    );
    return;
  }
  
  // For HTML navigation requests (e.g. first page load)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails, serve from cache
          return caches.match('/offline.html') || caches.match('/');
        })
    );
    return;
  }
  
  // Default fetch behavior for other requests
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
  );
});

// Background sync for offline operations
self.addEventListener('sync', event => {
  if (event.tag === 'sync-floor-plans') {
    event.waitUntil(syncFloorPlans());
  }
});

// Background sync function
async function syncFloorPlans() {
  try {
    const db = await openIndexedDB();
    const offlineChanges = await getOfflineChanges(db);
    
    if (offlineChanges.length === 0) {
      return;
    }
    
    console.log('[ServiceWorker] Syncing', offlineChanges.length, 'changes');
    
    // Process each change
    for (const change of offlineChanges) {
      try {
        await sendChangeToServer(change);
        await markChangeSynced(db, change.id);
      } catch (error) {
        console.error('[ServiceWorker] Failed to sync change:', error);
      }
    }
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
}

// Helper functions for IndexedDB operations
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('floor-plans-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('changes')) {
        db.createObjectStore('changes', { keyPath: 'id' });
      }
    };
  });
}

function getOfflineChanges(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['changes'], 'readonly');
    const store = transaction.objectStore('changes');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function markChangeSynced(db, changeId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['changes'], 'readwrite');
    const store = transaction.objectStore('changes');
    const request = store.delete(changeId);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

function sendChangeToServer(change) {
  return fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(change)
  }).then(response => {
    if (!response.ok) {
      throw new Error('Sync failed: ' + response.statusText);
    }
    return response.json();
  });
}

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
