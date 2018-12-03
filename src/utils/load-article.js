import { $$, wait, updateHash } from './';
import Stickyfill from 'stickyfilljs';
let queue = Promise.resolve();

// Array, containing an Object with the HTML node and metadata for every article
const articles = $$('.article').map((element, index) => ({
  element,
  index,
  name: element.id,
  path: `./articles/${element.id}.html`,
  inViewport: false,
}));

// Returns the article Object based on index or the article name
const findArticle = target => {
  return typeof target === 'number'
    ? articles[target]
    : articles.find(({ name }) => name === target);
};

/**
 * Fetches an articles HTML and inserts it into its DOM node
 * @param {boolean} article The article to load
 * @param {{fromObserver: boolean}} options Whether load was triggered by scroll
 */
const insertToDom = async (article, { fromObserver } = {}) => {
  const { path, element } = article;

  // Wait until article HTML is fetched and mandatory loading time has passed
  // (if loading was triggered by scrolling)
  const [html] = await Promise.all([
    fetch(path).then(response => response.text()),
    fromObserver && wait(1200),
  ]);

  // Artikel has been loaded in the mean time? Abort
  if (element.getAttribute('data-loaded') === 'true') return;

  // Insert article in DOM
  element.innerHTML = html;

  // Add newly added article number to position-sticky polyfill
  Stickyfill.addOne(element.querySelectorAll('.stickyfill'));

  // Mark article as loaded
  element.setAttribute('data-loaded', true);

  return;
};

/**
 * Loads an article only if needed: if it has been loaded already, it aborts.
 * If the loading is requested from the IntersectionObserver (due to scrolling),
 * it waits until previous articles have been fully loaded and only loads,
 * if the requested article is still visible.
 *
 * This prevents multiple articles being loaded due to the user scrolling fast.
 * @param {Object} article The article to load
 * @param {{fromObserver: boolean}} options Whether load was triggered by scroll
 */
const loadArticleIfNeeded = (article, options = {}) => {
  // Already loaded: Return immediately, nothing to do here...
  const isLoaded = article.element.getAttribute('data-loaded') === 'true';
  if (isLoaded) return;

  // Loading from observer: Wait until previous articles (queue) are loaded,
  // then load, if article is still in viewport
  // -> prevents simultaneous load of multiple articles due to too-fast scroll
  if (options.fromObserver) {
    return (queue = queue.then(() => {
      // will only be run after all other function chained using
      // queue = queue.then() are done
      article.inViewport && insertToDom(article, options);
    }));
  }

  // Loading not requested by scroll observer: Start immediately
  return insertToDom(article);
};

/**
 * Starts the scroll observer, loading new articles when the end is reached
 */
function startScrollObserver() {
  // Load article, if observer reports a change & article is visible
  const handleIntersection = entries => {
    entries.forEach(entry => {
      const article = findArticle(entry.target.id);
      // Update "inViewport" property to reflect visibility status
      article.inViewport = entry.isIntersecting;

      if (article.inViewport) {
        // Update hash, so URL links directly to current article
        updateHash(article.name);
        // Load the article
        loadArticleIfNeeded(article, { fromObserver: true });
      } else {
        const visibleArticle = articles.find(({ inViewport }) => inViewport);
        // No single article visible, but a URL hash is set? Reset
        if (!visibleArticle) location.hash && updateHash('');
        // Else: Set hash to (still) visible article
        else updateHash(visibleArticle.name);
      }
    });
  };

  // Observe all articles to watch when they become visible
  const options = { rootMargin: '-1px 0px' };
  const articleObserver = new IntersectionObserver(handleIntersection, options);
  articles.forEach(({ element }) => articleObserver.observe(element));
}

/**
 * Main function to load an article.
 * Loads the article and all articles preceding it.
 * @param {string|number} target Name or index (zero-based) of the article
 */
async function loadArticle(target) {
  const targetArticle = findArticle(target);
  if (!targetArticle) return;

  // Load article + articles preceding it (index lesser than/equal to target)
  const articlesToLoad = articles
    .filter((_, index) => index <= targetArticle.index)
    .map(loadArticleIfNeeded);

  try {
    // Wait, until all articles are loaded
    await Promise.all(articlesToLoad);
  } catch (error) {
    return console.error(
      `Fehler beim Laden des Artikels ${targetArticle.name}: ${error}`,
    );
  }

  return targetArticle;
}

export { startScrollObserver, loadArticle };
export default loadArticle;
