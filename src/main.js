import { $, debounce, isCrawler } from './utils';
import {
  startScrollObserver,
  loadArticle,
  articles,
} from './utils/load-article';

async function init() {
  // Check if device has a touch interface to adjust hint on splash screen
  // ('click to continue' / 'tap screen to continue')
  const deviceSupportsTouch = Boolean(
    'ontouchstart' in window ||
      window.navigator.maxTouchPoints > 0 ||
      window.navigator.msMaxTouchPoints > 0 ||
      (window.DocumentTouch && document instanceof DocumentTouch),
  );
  if (deviceSupportsTouch) document.body.classList.add('supports-touch');

  // Manually calculate mobile viewport size, see:
  // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
  const updateWindowHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  updateWindowHeight();
  window.addEventListener('resize', debounce(updateWindowHeight, 500));

  // HTML elements
  const splash = $('.js-splash');
  const main = $('.js-main');

  // Scroll down to first article when clicking/tapping the splash screen
  splash.addEventListener('click', () => {
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const { hash } = window.location;
  const targetId = hash.slice(1);
  // Try loading the article specified in the hash
  const targetArticle = await loadArticle(targetId);
  // No (valid) article? Just load the first one
  if (!targetArticle) await loadArticle(0);

  // Crawler? Load all articles, at least those running JS get all markup (SEO)
  if (isCrawler) await loadArticle(articles.length - 1);

  // Update page to allow scrolling and adjust styling
  document.body.classList.remove('empty');
  // Start observer, so further articles are loaded upon reaching the end
  startScrollObserver();

  // Update sticky header, which has to be repositioned now that an article
  // has been loaded and the window is scrollable
  window.Stickyfill.refreshAll(); // ! see utils/polyfills.js

  // If there was a specific article targeted in the URL hash: scroll to it
  if (targetArticle) {
    targetArticle.element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  // Listen for further hash changes
  window.addEventListener('hashchange', async () => {
    const { hash } = window.location;
    const targetId = hash.slice(1);
    const target = document.getElementById(targetId);
    if (target && target.getAttribute('data-loaded') === 'false') {
      const article = await loadArticle(targetId);
      if (!article) return;
      article.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// Go!
window.onload = init;
