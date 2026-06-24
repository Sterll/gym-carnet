/* Service worker — offline pour la salle, mais toujours à jour quand il y a du réseau.
   Code (html/js/css) : network-first (frais en priorité, cache en secours hors-ligne).
   Statique (icônes/manifest) : cache-first. */
const CACHE = "carnet-yanis-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isCode(req) {
  if (req.mode === "navigate") return true;
  const u = new URL(req.url);
  return /\.(?:html|js|css|webmanifest)$/.test(u.pathname);
}

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  if (isCode(request)) {
    // network-first : on tente le réseau, on rafraîchit le cache, sinon on sert le cache
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match(request).then((c) => c || caches.match("./index.html")))
    );
    return;
  }

  // cache-first pour le statique (icônes, manifest images…)
  e.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      if (res && res.status === 200 && res.type === "basic") {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
      }
      return res;
    }))
  );
});
