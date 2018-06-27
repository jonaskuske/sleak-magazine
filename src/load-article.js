import { $, wait } from './utils';
let queue = Promise.resolve();

const articles = $('.article').map((element, index) => ({
  element,
  index,
  name: element.id,
  inViewport: false,
}));

const findArticle = target => {
  return typeof target === 'number'
    ? articles[target - 1]
    : articles.find(({ name }) => name === target);
};

const insertToDom = (article, { fromObserver, scrollIntoView } = {}) => {
  return new Promise(async resolve => {
    const { name, element } = article;
    // Ladeverzögerung für ersten Artikel deaktiviert, sonst aktiv bei Observer
    const delay = fromObserver && name !== articles[0].name;
    const path = `./articles/${name}.html`;

    const [html] = await Promise.all([
      fetch(path).then(response => response.text()),
      delay ? wait(2000) : Promise.resolve(),
    ]);

    element.innerHTML = html;
    element.dataset.loaded = true;

    // Neu erstellte Artikelnummer interaktiv machen, sodass sie Auswahl öffnet
    element.querySelector('.article__number').addEventListener('click', () => {
      $('.article-selection')[0].classList.add('article-selection--open');
    });

    if (scrollIntoView) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    resolve();
  });
};

const loadArticle = (article, options = {}) => {
  const loaded = article.element.dataset.loaded === 'true';
  return new Promise(resolve => {
    if (loaded && options.scrollIntoView) {
      article.element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return resolve();
    }
    if (loaded || (options.fromObserver && !article.inViewport)) {
      return resolve();
    }
    queue = queue.then(() => {
      if (!options.fromObserver || article.inViewport) {
        insertToDom(article, options);
      }
    });
    return queue.then(resolve);
  });
};

const callback = entries => {
  entries.forEach(entry => {
    const article = findArticle(entry.target.id);
    article.inViewport = entry.isIntersecting;

    loadArticle(article, { fromObserver: true });
  });
};

const articleObserver = new IntersectionObserver(callback);
articles.forEach(({ element }) => articleObserver.observe(element));

export default async target => {
  const article = findArticle(target);

  const loadPreviousArticles = articles
    .filter((_, index) => index < article.index)
    .map(loadArticle);

  await Promise.all(loadPreviousArticles);

  loadArticle(article, { scrollIntoView: true });
};
