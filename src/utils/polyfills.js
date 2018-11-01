import 'babel-polyfill';
import 'intersection-observer';
import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

// IE workarounds
if (!NodeList.prototype.forEach)
  NodeList.prototype.forEach = Array.prototype.forEach;

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector;
}

//  Kein nativer Smoothscroll: smoothscroll-polyfill auf Links zu # anwenden
if (!('scrollBehavior' in document.documentElement.style)) {
  document.querySelectorAll('a').forEach(link => {
    // Nur per JS handlen, falls Link zu # auf aktueller Seite führt
    if (
      link.href.includes('#') &&
      link.hostname === location.hostname &&
      link.pathname === location.pathname
    ) {
      const isScrollTop = link.href.endsWith('#');
      link.addEventListener('click', event => {
        const target = document.getElementById(link.hash.slice(1));

        if (isScrollTop || target) {
          // Default Scroll deaktivieren
          event.preventDefault();

          // Per JavaScript Scrollen starten
          if (isScrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
          else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  });
}
