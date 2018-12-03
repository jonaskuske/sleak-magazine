import './polyfills';
import './menu';
import './selection-menu';
import './detect-scrollbar';

// If in production: register service worker
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  navigator.serviceWorker
    .register('/serviceworker.js')
    // .then(() => console.log(`Service Worker erfolgreich registriert`))
    .catch(error =>
      console.warn(`Fehler beim Registrieren des Service Workers: ${error}`),
    );
}

// Make current version available on window, useful for debugging
window.__version__ = process.env.npm_package_version;

console.log(
  'Neugierig, DevTool-Ganove? Source Code hier: https://github.com/jonaskuske/sleak-magazine ✨',
);
