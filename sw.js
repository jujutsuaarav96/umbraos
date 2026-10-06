const CACHE = 'umbraos-app-v1';
const ASSETS = [
  './',
  './demos/app.html',
  './demos/manifest.json',
  './demos/icon-192.png',
  './demos/icon-512.png',
  './sw.js',
  './manifest.json',
  './index.html',
  './logo.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => {
          if (e.request.mode === 'navigate') return caches.match('./demos/app.html');
        });
    })
  );
});
