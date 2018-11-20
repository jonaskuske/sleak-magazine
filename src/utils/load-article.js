import { $$, wait, updateHash } from './';
import Stickyfill from 'stickyfilljs';
let queue = Promise.resolve();

// Array, mit einem Objekt für jeden Artikel
const articles = $$('.article').map((element, index) => ({
  element,
  index,
  name: element.id,
  path: `./articles/${element.id}.html`,
  inViewport: false,
}));

// Liefert Artikel-Objekt anhand von Index oder Artikelname
const findArticle = target => {
  return typeof target === 'number'
    ? articles[target]
    : articles.find(({ name }) => name === target);
};

const insertToDom = async (article, { fromObserver } = {}) => {
  const { path, element } = article;

  // Warten bis HTML des Artikels abgerufen und ggf. Wartezeit vorbei ist
  const [html] = await Promise.all([
    fetch(path).then(response => response.text()),
    fromObserver && wait(1200),
  ]);

  // Artikel inzwischen schon (parallel) fertig geladen? Abbrechen
  if (element.getAttribute('data-loaded') === 'true') return;

  // Artikel in DOM einfügen
  element.innerHTML = html;

  // Neu hinzugefügte Artikel-Nummer polyfillen
  Stickyfill.addOne(element.querySelectorAll('.stickyfill'));

  // Als geladen markieren
  element.setAttribute('data-loaded', true);

  return;
};

const loadArticleIfNeeded = (article, options = {}) => {
  // Schon geladen: Sofort returnen, nothing to do here...
  const isLoaded = article.element.getAttribute('data-loaded') === 'true';
  if (isLoaded) return;

  // Laden durch Observer: Warten bis Laden früherer Artikel (queue) fertig,
  // dann laden, falls Artikel immer noch im Viewport ist
  // -> stoppt gleichzeitiges Laden mehrerer Artikel bei zu schnellem Scrollen
  if (options.fromObserver) {
    return (queue = queue.then(() => {
      // wird erst ausgeführt, nachdem alle anderen Funktionen,
      // die per queue = queue.then() angehängt wurden, beendet sind
      article.inViewport && insertToDom(article, options);
    }));
  }

  // Laden nicht von Observer angefordert: Sofort starten
  return insertToDom(article);
};

function startScrollObserver() {
  // Artikel laden, falls Observer eine Veränderung meldet & Artikel sichtbar
  const handleIntersection = entries => {
    entries.forEach(entry => {
      const article = findArticle(entry.target.id);
      article.inViewport = entry.isIntersecting;

      if (article.inViewport) {
        // Hash updaten, damit URL direkt auf Artikel verweist
        updateHash(article.name);
        loadArticleIfNeeded(article, { fromObserver: true });
      } else {
        const visibleArticle = articles.find(({ inViewport }) => inViewport);
        // Kein einziger Artikel sichtbar, aber aktuell ein Hash gesetzt? Reset
        if (!visibleArticle && location.hash) {
          updateHash('');
        } else updateHash(visibleArticle.name);
      }
    });
  };

  // Beobachtet jeden Artikel im articles array auf Sichtbarkeitsänderungen
  const options = { rootMargin: '-1px 0px' };
  const articleObserver = new IntersectionObserver(handleIntersection, options);
  articles.forEach(({ element }) => articleObserver.observe(element));
}

async function loadArticle(target) {
  const targetArticle = findArticle(target);
  if (!targetArticle) return;

  // Artikel + alle Artikel oberhalb (index kleiner/gleich Zielartikel) laden
  const articlesToLoad = articles
    .filter((_, index) => index <= targetArticle.index)
    .map(loadArticleIfNeeded);

  try {
    // Warten, bis alle Artikel geladen sind
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
