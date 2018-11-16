import './utils/appshell';
import './utils/article-selection';
import Stickyfill from 'stickyfilljs';

import { $, debounce, shrug } from './utils';
import { startScrollObserver, loadArticle } from './utils/load-article';

// Prüfen, ob Gerät ein Touch-Interface hat
const deviceSupportsTouch = Boolean(
  'ontouchstart' in window ||
    window.navigator.maxTouchPoints > 0 ||
    window.navigator.msMaxTouchPoints > 0 ||
    (window.DocumentTouch && document instanceof DocumentTouch),
);
if (deviceSupportsTouch) document.body.classList.add('supports-touch');

// Mobile Viewport-Größe manuell berechnen, vgl.:
// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
const updateWindowHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};
updateWindowHeight();
window.addEventListener('resize', debounce(updateWindowHeight, 500));

// Warten, bis erster Artikel geladen, dann Hinweis auf Splashscreen zeigen
// und Scroll-Observer starten, um bei Scrollen weitere Artikel lazy nachzuladen
loadArticle(0, { scroll: false }).then(() => {
  document.body.classList.remove('empty');
  startScrollObserver();
  Stickyfill.refreshAll();
});

// HTML Elemente
const splash = $('.js-splash');
const main = $('.js-main');

// Bei Klick auf Splashscreen zu Content scrollen
splash.addEventListener('click', () => {
  main.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Hash überprüfen, sodass mit per # in URL zu bestimmten Artikeln springen kann
const loadArticleFromHash = ({ shouldShrug } = {}) => {
  const { hash } = window.location;
  if (!hash) return;
  const targetArticle = hash.slice(1);

  shouldShrug && shrug(targetArticle); // 🤷🏻‍
  loadArticle(targetArticle);
};

loadArticleFromHash({ shouldShrug: true });
window.addEventListener('hashchange', loadArticleFromHash, false);

if (module.hot) {
  module.hot.dispose(() => {
    window.removeEventListener('hashchange', loadArticleFromHash, false);
  });
}
