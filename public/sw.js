/* Service worker for Hoppspelet.
   Cache-first so the game works fully offline after the first visit.
   __BUILD_STAMP__ is replaced with the build timestamp by the Dockerfile, so
   each new image automatically gets a new cache version and old files are
   cleared. When the file is unstamped (local dev), the string is still a
   valid cache key. */
"use strict";

const CACHE_VERSION = "hoppspelet-__BUILD_STAMP__";

const PRECACHE = [
  ".",
  "index.html",
  "styles.css",
  "favicon.svg",
  "manifest.webmanifest",
  "assets/logo.svg",
  "assets/screens/screen1.jpg",
  "assets/screens/screen2.jpg",
  "assets/screens/screen3.jpg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-192-maskable.png",
  "icons/icon-512-maskable.png",
  "icons/apple-touch-icon.png",
  "minimotor/index.js",
  "minimotor/engine.js",
  "minimotor/audio.js",
  "js/state.js",
  "js/themes.js",
  "js/world.js",
  "js/audio.js",
  "js/gameplay.js",
  "js/input.js",
  "js/update.js",
  "js/render-helpers.js",
  "js/scenery.js",
  "js/sprites.js",
  "js/main.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      // cache: "reload" gar forbi HTTP-cachen sa en ny CACHE_VERSION aldrig
      // fylls med gamla filer fran webblasarens vanliga cache.
      .then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy))
          );
        }
        return response;
      });
    })
  );
});
