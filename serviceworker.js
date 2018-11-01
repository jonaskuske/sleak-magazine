// Use name & version fields from package.json to manage caches
const PACKAGE_NAME = process.env.npm_package_name;
const PACKAGE_VERSION = process.env.npm_package_version;
const CACHE_NAME = `${PACKAGE_NAME}@${PACKAGE_VERSION}`;

const ALLOWED_CACHES = [
  CACHE_NAME,
  // ! If you want to whitelist any caches, add them here
  // ! Any caches with a name not found in this array will be deleted
  // ! from the client's browser once the service worker is activated
];

const STATIC_ASSETS = [
  '.',
  './articles/antarktis.html',
  './articles/apollo.html',
  './articles/bertram.html',
  './articles/graffiti.html',
  './articles/ki.html',
  './articles/kunst.html',
  './articles/medien.html',
  './articles/melanka.html',
  './articles/nachbar.html',
  './articles/oesterreich.html',
  './articles/seemann.html',
];

const FALLBACK_IMAGE = `<svg xmlns="http://www.w3.org/2000/svg"><defs><style>.text{font-family:Lato,sans-serif;text-align:center}@media screen and (max-width:370px){.text{font-size:12px}}</style></defs><rect width="100%" height="100%" fill="#fff"/><image width="80" height="120" x="50%" y="50%" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiBmaWxsPSIjRDNEM0QzIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+DQogICAgPHBhdGggZD0iTTg4LjE3LDY5LjMyQTIyLDIyLDAsMCwwLDc3Ljc5LDM3Ljc3YTIyLDIyLDAsMCwwLTIxLjkxLTIwLjIsMjAuMjksMjAuMjksMCwwLDAtMTMuNjcsNC44MWw0LjU3LDUuM2ExMy4zMSwxMy4zMSwwLDAsMSw5LjEtMy4xMSwxNSwxNSwwLDAsMSwxNSwxNWMwLC4wNiwwLC4xMywwLC4xOXMwLC4yNiwwLC4zOWwtLjEsMi43NSwyLjY1Ljc1YTE1LDE1LDAsMCwxLDguNzksMjIuMVoiLz4NCiAgICA8cGF0aCBkPSJNMjguNzYsODBINjAuNDRWNzNIMjguNzZhMTUsMTUsMCwwLDEtMTUtMTVBMTcsMTcsMCwwLDEsMjMuNiw0Mi43bC0yLjc5LTYuNDJBMjMuOTEsMjMuOTEsMCwwLDAsNi43OCw1OCwyMiwyMiwwLDAsMCwyOC43Niw4MFoiLz4NCiAgICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIxMDYuNzUiIHg9IjQ1LjUzIiB5PSItNC41OCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwLjE0IDQ4Ljk2KSByb3RhdGUoLTQ1KSIvPg0KPC9zdmc+DQo=" transform="translate(-40 -60)"/><text x="50%" y="50%" fill="#d3d3d3" class="text" text-anchor="middle" transform="translate(0 60)">Bild noch nicht für Offline-Nutzung gespeichert</text></svg>`;

// get the filenames to cache from the parcel-manifest and add them to cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache =>
        fetch('./parcel-manifest.json')
          .then(response => response.json())
          .then(assets => {
            const hashedAssets = Object.entries(assets)
              // filter out files that are unnecessary to cache
              .filter(
                ([sourceURL]) =>
                  !sourceURL.endsWith('.map') &&
                  !sourceURL.endsWith('.webmanifest'),
              )
              .map(([_, hashedURL]) => hashedURL);

            return cache.addAll([...STATIC_ASSETS, ...hashedAssets]);
          }),
      )
      .then(() => self.skipWaiting()),
  );
});

/* delete old caches on activation */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const cacheDeletePromises = cacheNames.map(cacheName => {
        if (!ALLOWED_CACHES.includes(cacheName)) {
          return caches.delete(cacheName);
        }
      });
      return Promise.all(cacheDeletePromises);
    }),
  );
});

const checkResponseStatus = r =>
  new Promise((res, rej) => {
    if ((r.status >= 200 && r.status < 300) || r.status === 0) res(r);
    else rej(r.statusText);
  });
/* Helper functions to determine whether requests/responses should be cached */
const isRequestCacheable = request => {
  const url = new URL(request.url);
  if (url.protocol === 'chrome-extension:') return false;

  return true;
};
const isResponseCacheable = response => {
  // don't cache opaque response to prevent exceeding cache size quota
  // see https://cloudfour.com/thinks/when-7-kb-equals-7-mb/
  if (response.status === 0 || response.type === 'opaque') return false;

  return true;
};

const requestFailingWith404 = event => {
  return fetch(event.request).catch(() => {
    const body = JSON.stringify({
      error:
        "Sorry, you're offline. Try again once you have a working internet connection.",
    });
    const headers = { 'Content-Type': 'application/json' };
    return new Response(body, {
      status: 404,
      statusText: 'Not Found',
      headers,
    });
  });
};
const requestThenCache = (event, cache) => {
  return fetch(event.request)
    .then(checkResponseStatus)
    .then(response => {
      if (isResponseCacheable(response)) {
        cache.put(event.request, response.clone());
      }
      return response;
    })
    .catch(() => {
      if (event.request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
        return new Response(FALLBACK_IMAGE, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-store',
          },
        });
      } else return cache.match(event.request);
    });
};

self.addEventListener('fetch', event => {
  // if request should not be cached: respond with normal 404 fetch and return
  if (!isRequestCacheable(event.request)) {
    event.respondWith(requestFailingWith404(event));
    return;
  }

  // ! ignore query strings
  const requestURL = event.request.url;
  const request = requestURL.includes('?')
    ? new Request(requestURL.substring(requestURL.indexOf('?') + 1))
    : event.request;

  event.respondWith(
    caches
      .match(request)
      .then(checkResponseStatus)
      .then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          if (navigator.onLine) requestThenCache(event, cache);
          return response;
        });
      })
      .catch(() =>
        caches.open(CACHE_NAME).then(cache => requestThenCache(event, cache)),
      ),
  );
});
