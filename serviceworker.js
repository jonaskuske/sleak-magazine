parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"Oehu":[function(require,module,exports) {
function t(t){return r(t)||n(t)||e()}function e(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function n(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}function r(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}function i(t,e){return c(t)||a(t,e)||s()}function s(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function a(t,e){var n=[],r=!0,i=!1,s=void 0;try{for(var a,c=t[Symbol.iterator]();!(r=(a=c.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(o){i=!0,s=o}finally{try{r||null==c.return||c.return()}finally{if(i)throw s}}return n}function c(t){if(Array.isArray(t))return t}var o="sleak-magazine",u="2.2.4",l="".concat(o,"@").concat(u),h=[l],w=["./articles/projekt-antarktis.html","./articles/film-ab-bheaven.html","./articles/axel-bertram.html","./articles/bringt-farbe-in-die-stadt.html","./articles/wie-ki-die-designwelt-aendert.html","./articles/kunst-design.html","./articles/digitale-medien.html","./articles/moin-melanka.html","./articles/back-to-print.html","./articles/oesterreichs-newcomer-mihael-kobas.html","./articles/zwischen-seemannsgarn-und-strandgut.html"],f='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style>.text{font-family:Lato,sans-serif;text-align:center}@media screen and (max-width:370px){.text{font-size:12px}}</style></defs><rect width="100%" height="100%" fill="#fff"/><image width="80" height="120" x="50%" y="50%" transform="translate(-40 -60)" xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiBmaWxsPSIjRDNEM0QzIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+DQogICAgPHBhdGggZD0iTTg4LjE3LDY5LjMyQTIyLDIyLDAsMCwwLDc3Ljc5LDM3Ljc3YTIyLDIyLDAsMCwwLTIxLjkxLTIwLjIsMjAuMjksMjAuMjksMCwwLDAtMTMuNjcsNC44MWw0LjU3LDUuM2ExMy4zMSwxMy4zMSwwLDAsMSw5LjEtMy4xMSwxNSwxNSwwLDAsMSwxNSwxNWMwLC4wNiwwLC4xMywwLC4xOXMwLC4yNiwwLC4zOWwtLjEsMi43NSwyLjY1Ljc1YTE1LDE1LDAsMCwxLDguNzksMjIuMVoiLz4NCiAgICA8cGF0aCBkPSJNMjguNzYsODBINjAuNDRWNzNIMjguNzZhMTUsMTUsMCwwLDEtMTUtMTVBMTcsMTcsMCwwLDEsMjMuNiw0Mi43bC0yLjc5LTYuNDJBMjMuOTEsMjMuOTEsMCwwLDAsNi43OCw1OCwyMiwyMiwwLDAsMCwyOC43Niw4MFoiLz4NCiAgICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIxMDYuNzUiIHg9IjQ1LjUzIiB5PSItNC41OCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwLjE0IDQ4Ljk2KSByb3RhdGUoLTQ1KSIvPg0KPC9zdmc+DQo="/><text x="50%" y="50%" fill="#d3d3d3" class="text" text-anchor="middle" transform="translate(0 60)">Bild noch nicht für Offline-Nutzung gespeichert</text></svg>';self.addEventListener("install",function(e){e.waitUntil(caches.open(l).then(function(e){return fetch("./parcel-manifest.json").then(function(t){return t.json()}).then(function(n){var r=Object.entries(n).filter(function(t){var e=i(t,1)[0];return!e.endsWith(".map")&&!e.endsWith(".webmanifest")}).map(function(t){var e=i(t,2);e[0];return e[1].replace(/https:\/\/?/,"https://")});return e.addAll(w.concat(t(r)))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(t){t.waitUntil(caches.keys().then(function(t){var e=t.map(function(t){if(!h.includes(t))return caches.delete(t)});return Promise.all(e)}))});var d=function(t){return new Promise(function(e,n){t.status>=200&&t.status<300||0===t.status?e(t):n(t.statusText)})},m=function(t){return"chrome-extension:"!==new URL(t.url).protocol},M=function(t){return 0!==t.status&&"opaque"!==t.type},g=function(t){return fetch(t.request).catch(function(){var t=JSON.stringify({error:"Sorry, you're offline. Try again once you have a working internet connection."});return new Response(t,{status:404,statusText:"Not Found",headers:{"Content-Type":"application/json"}})})},L=function(t,e){return fetch(t.request).then(d).then(function(n){return M(n)&&e.put(t.request,n.clone()),n}).catch(function(){return t.request.url.match(/\.(jpe?g|png|gif|svg)$/)?new Response(f,{headers:{"Content-Type":"image/svg+xml","Cache-Control":"no-store"}}):e.match(t.request)})};self.addEventListener("fetch",function(t){if(m(t.request)){var e=t.request.url,n=e.includes("?")?new Request(e.substring(e.indexOf("?")+1)):t.request;t.respondWith(caches.match(n).then(d).then(function(e){return caches.open(l).then(function(n){return navigator.onLine&&L(t,n),e})}).catch(function(){return caches.open(l).then(function(e){return L(t,e)})}))}else t.respondWith(g(t))});
},{}]},{},["Oehu"], null)
//# sourceMappingURL=https://sleak-mag.design/serviceworker.map