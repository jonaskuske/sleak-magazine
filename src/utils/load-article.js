import { $, wait } from './';
let queue = Promise.resolve();

// Array, mit einem Objekt für jeden Artikel
const articles = $('.article').map((element, index) => ({
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
  const { name, path, element } = article;
  // Laden durch Observer: Verzögerung für alle Artikel außer dem ersten aktiv
  const delay = fromObserver ? name !== articles[0].name : false;

  // Warten bis HTML des Artikels abgerufen und ggf. Wartezeit vorbei ist
  const [html] = await Promise.all([
    fetch(path).then(response => response.text()),
    delay && wait(1200),
  ]);

  // Artikel inzwischen schon (parallel) fertig geladen? Abbrechen
  if (element.dataset.loaded === 'true') return;

  // Artikel in DOM einfügen und als geladen markieren
  element.innerHTML = html;
  element.dataset.loaded = true;

  return;
};

const loadArticleIfNeeded = (article, options = {}) => {
  // Schon geladen: Sofort returnen, nothing to do here...
  const isLoaded = article.element.dataset.loaded === 'true';
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
  const handleVisibilityChange = entries => {
    entries.forEach(entry => {
      const article = findArticle(entry.target.id);
      article.inViewport = entry.isIntersecting;

      if (article.inViewport) {
        loadArticleIfNeeded(article, { fromObserver: true });
      }
    });
  };

  // Beobachtet jeden Artikel im articles array auf Sichtbarkeitsänderungen
  const articleObserver = new IntersectionObserver(handleVisibilityChange);
  articles.forEach(({ element }) => articleObserver.observe(element));
}

async function loadArticle(target, { scroll = true } = {}) {
  const targetArticle = findArticle(target);
  if (!targetArticle) return console.warn(`Artikel nicht gefunden: ${target}`);

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

  // ! Entfernen, sobald Scroll-Navigation richtig funktioniert
  await wait(1400);

  // Dann zu Zielartikel scrollen
  if (scroll) {
    targetArticle.element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  return targetArticle;
}

export { startScrollObserver, loadArticle };
export default loadArticle;
