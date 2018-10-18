import './utils/appshell';
import './utils/article-selection';

import { $, debounce } from './utils';
import { startScrollObserver, loadArticle } from './utils/load-article';

/* vgl.: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/ */
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
});

// Prüfen, ob Gerät ein Touch-Interface hat
const deviceSupportsTouch = Boolean(
  'ontouchstart' in window ||
    window.navigator.maxTouchPoints > 0 ||
    window.navigator.msMaxTouchPoints > 0 ||
    (window.DocumentTouch && document instanceof DocumentTouch),
);
if (deviceSupportsTouch) document.body.classList.add('supports-touch');

// HTML Elemente
const splash = $('.js-splash')[0];
const main = $('.js-main')[0];

// Bei Klick auf Splashscreen zu Content scrollen
splash.addEventListener('click', () => {
  main.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Hash überprüfen, sodass mit per # in URL zu bestimmten Artikeln springen kann
const loadArticleFromHash = () => {
  const { hash } = window.location;
  if (!hash) return;

  const targetArticle = hash.slice(1);
  loadArticle(targetArticle);
};

loadArticleFromHash();
window.addEventListener('hashchange', loadArticleFromHash, false);
