// Service Worker: legt alle Dateien beim ersten Besuch in den Cache -> App läuft danach offline.
// Bei Änderungen an den Dateien die Versionsnummer erhöhen (v1 -> v2), damit der Cache erneuert wird.
const CACHE = 'vokabeltrainer-v1';
const FILES = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Erst im Cache nachsehen, sonst aus dem Netz laden
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
