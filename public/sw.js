/*
 * Service Worker: hält die App selbst offline verfügbar — Kontakte, Rechte und
 * Meldewege sollen auch ohne Netz aufgehen.
 *
 * Er legt ausschließlich Dateien der App ab, niemals Antworten von /api. Bis
 * zum 24.9.2026 landete dort jede Antwort im Cache, auch die Meldungen aus den
 * Rollen-Postfächern. Die blieben dann im Browser liegen — auf einem geteilten
 * Gerät auch nach dem Schließen, und „Alle Inhalte löschen" erreichte sie nicht.
 * Deshalb die neue Versionsnummer: Beim Aktivieren wird der alte Cache gelöscht.
 */
const CACHE_NAME = "db-peace-ai-v2";
const ASSETS_TO_CACHE = ["/", "/index.html", "/manifest.json", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))),
      ),
  );
  self.clients.claim();
});

function darfInDenCache(request) {
  if (request.method !== "GET") return false;
  const url = new URL(request.url);
  return url.origin === self.location.origin && !url.pathname.startsWith("/api/");
}

// Erst das Netz, bei fehlender Verbindung der Cache.
self.addEventListener("fetch", (event) => {
  if (!darfInDenCache(event.request)) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request)),
  );
});
