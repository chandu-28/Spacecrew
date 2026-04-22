const CACHE_NAME = 'spacecrew-v2';
const ASSETS = [
  './mission_select.html',
  './o2_regulator.html',
  './fuel_reactor.html',
  './nav_computer.html',
  './power_grid.html',
  './med_bay.html',
  './docking_ring.html',
  './blast_shield.html',
  './engine_core.html',
  './warp_drive.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './audio.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const isHTML = e.request.destination === 'document' ||
                 e.request.url.endsWith('.html');
  if (isHTML) {
    // Network-first for HTML: always fresh when online, cached when offline
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request)
                       .then(cached => cached || caches.match('./mission_select.html')))
    );
  } else {
    // Cache-first for everything else (manifest, icons)
    e.respondWith(
      caches.match(e.request)
        .then(cached => cached || fetch(e.request))
    );
  }
});
