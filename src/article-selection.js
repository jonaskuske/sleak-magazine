import { $ } from './utils';
import goToArticle from './utils/load-article';

// HTML Elemente
const articleSelection = $('.article-selection')[0];
const articleSelectionButtons = articleSelection.querySelectorAll(
  '.article-selection__button',
);

// Bei Klick
articleSelectionButtons.forEach(button => {
  button.addEventListener('click', handleButtonClick);
});

async function handleButtonClick() {
  // Ladesymbol anzeigen
  this.classList.add('.article-selection__button--loading');

  const target = parseInt(this.dataset.target, 10);
  if (!target) return;

  // Warten bis Artikel geladen
  await goToArticle(target);

  // Dann Ladesymbol verstecken und Auswahl schließen
  this.classList.remove('.article-selection__button--loading');
  closeArticleSelection();
}

// Bei Klick auf Artikelnummer die Auswahl öffnen
window.addEventListener('click', ({ target }) => {
  if (target.matches('.article__number')) openArticleSelection();
});

export function openArticleSelection() {
  articleSelection.classList.add('article-selection--open');
}

export function closeArticleSelection() {
  articleSelection.classList.remove('article-selection--open');
}
