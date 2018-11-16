import '../assets/styles';
import './polyfills';
import './menu';
import './selection-menu';

// Falls in production: Service Worker registrieren
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  navigator.serviceWorker
    .register('/serviceworker.js')
    .then(() => console.log(`Service Worker erfolgreich registriert`))
    .catch(error =>
      console.warn(`Fehler beim Registrieren des Service Workers: ${error}`),
    );
}

console.log(
  'Neugierig, DevTool-Ganove? Source Code hier: https://github.com/jonaskuske/sleak-magazine ✨',
);
