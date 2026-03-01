const CACHE_VERSION = "fretboard-trainer-v2";
const SHELL_CACHE = `shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const APP_SHELL = [
  "./",
  "./trainer.html",
  "./trainer-controller.js",
  "./ui.js",
  "./audio-engine.js",
  "./app.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const appFileRe = /\.(?:html|js|css|webmanifest)$/i;
  const isAppFile = isSameOrigin && appFileRe.test(url.pathname);

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("./trainer.html")))
    );
    return;
  }

  if (!isSameOrigin) return;

  // Always prefer network for app code so UI/logic updates are seen immediately.
  if (isAppFile) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(async () => {
          const runtimeCached = await caches.open(RUNTIME_CACHE).then((cache) => cache.match(req));
          if (runtimeCached) return runtimeCached;
          const shellCached = await caches.open(SHELL_CACHE).then((cache) => cache.match(req));
          return shellCached || caches.match("./trainer.html");
        })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        fetch(req)
          .then((fresh) => caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, fresh)))
          .catch(() => {});
        return cached;
      }
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
        return res;
      });
    })
  );
});
