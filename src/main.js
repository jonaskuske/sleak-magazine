import './utils/appshell';
import './utils/article-selection';

import { $ } from './utils';
import { startScrollObserver, loadArticle } from './utils/load-article';

// Startet Observer, um Artikel nachzuladen, wenn Ende der Seite erreicht wird
startScrollObserver();

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
