import './utils/appshell';
import Stickyfill from 'stickyfilljs';

import { $, debounce } from './utils';
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

// HTML Elemente
const splash = $('.js-splash');
const main = $('.js-main');

// Bei Klick auf Splashscreen zu Content scrollen
splash.addEventListener('click', () => {
  main.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

async function init() {
  const { hash } = window.location;
  const targetId = hash.slice(1);
  const targetArticle = await loadArticle(targetId);
  if (!targetArticle) await loadArticle(0);

  document.body.classList.remove('empty');
  startScrollObserver();
  Stickyfill.refreshAll();

  if (targetArticle) {
    targetArticle.element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  window.addEventListener('hashchange', async () => {
    const { hash } = window.location;
    const targetId = hash.slice(1);
    const target = document.getElementById(targetId);
    if (target && target.getAttribute('data-loaded') === 'false') {
      const article = await loadArticle(window.location.hash.slice(1));
      if (!article) return;
      article.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// Go!
init();
