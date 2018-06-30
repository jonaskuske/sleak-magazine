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

// Liefert Artikel-Objekt anhand von Index (startend bei 1) oder Artikelname
const findArticle = target => {
  return typeof target === 'number'
    ? articles[target - 1]
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

async function loadArticle(target) {
  const targetArticle = findArticle(target);

  // Artikel + alle Artikel oberhalb (index kleiner/gleich Zielartikel) laden
  const articlesToLoad = articles
    .filter((article, index) => index <= targetArticle.index)
    .map(loadArticleIfNeeded);

  // warten bis alle geladen sind
  await Promise.all(articlesToLoad);

  // Dann zu Zielartikel scrollen
  targetArticle.element.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return targetArticle;
}

export { startScrollObserver, loadArticle };
export default loadArticle;
