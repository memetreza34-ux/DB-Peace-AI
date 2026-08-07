const CACHE_PREFIX = "db-peace-ai-";
const CACHE_NAME = `${CACHE_PREFIX}v3`;
const APP_SHELL = ["/", "/index.html", "/manifest.json", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
        .map((name) => caches.delete(name)),
    )),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // API-, Chat- und Quiz-Antworten können sensible Inhalte enthalten und werden nie gecacht.
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  event.respondWith(handleStaticRequest(request, url));
});

async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    if (canCache(response)) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put("/index.html", response.clone());
    }
    return response;
  } catch {
    return (await caches.match("/index.html")) || new Response(
      "DB Peace AI ist offline und wurde auf diesem Gerät noch nicht vollständig geladen.",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } },
    );
  }
}

async function handleStaticRequest(request, url) {
  const cached = await caches.match(request);

  try {
    const response = await fetch(request);
    if (canCache(response) && isStaticAsset(url.pathname)) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return cached || response;
  } catch {
    return cached || Response.error();
  }
}

function canCache(response) {
  if (!response?.ok || response.type === "error") return false;
  const cacheControl = response.headers.get("Cache-Control") || "";
  return !/no-store/i.test(cacheControl);
}

function isStaticAsset(pathname) {
  return /\.(?:js|css|svg|png|jpg|jpeg|webp|woff2?|json)$/.test(pathname);
}
