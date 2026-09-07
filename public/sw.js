const CACHE = "the-truth-shell-v7";
const SCOPE = new URL("./", self.location.href).pathname;

function scoped(path) {
  return `${SCOPE}${String(path).replace(/^\//, "")}`;
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache
          .addAll([
            scoped("/manifest.json"),
            scoped("/icon-32.png"),
            scoped("/icon-192.png"),
            scoped("/icon-512.png"),
            scoped("/apple-touch-icon.png"),
          ])
          .catch(() => undefined)
      )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/@") || url.pathname.startsWith("/node_modules") || url.search.includes("t=")) {
    return;
  }
  if (
    url.pathname.startsWith(scoped("/ebible")) ||
    url.pathname.startsWith(scoped("/api/")) ||
    url.pathname.startsWith(scoped("/corpus/")) ||
    url.pathname.startsWith(scoped("/dss/")) ||
    url.pathname === scoped("/__lan.json") ||
    url.pathname === scoped("/version.json") ||
    url.pathname === scoped("/sw.js")
  ) {
    return;
  }

  const isDocument =
    request.mode === "navigate" ||
    request.destination === "document" ||
    url.pathname === SCOPE ||
    url.pathname === scoped("/index.html");

  if (isDocument) {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match(SCOPE)) || Response.error())
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok && request.url.startsWith(self.location.origin)) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        return Response.error();
      })
  );
});
