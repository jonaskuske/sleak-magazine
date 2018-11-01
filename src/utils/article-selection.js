import { $ } from '.';
import goToArticle from './load-article';

// HTML Elemente
const articleSelection = $('.article-selection')[0];
const articleSelectionButtons = articleSelection.querySelectorAll(
  '.article-selection__button',
);

// CSS Klassen
const ACTIVE_CLASS = 'article-selection__button--active';
const LOADING_CLASS = 'article-selection__button--loading';

// Bei Klick auf Button Artikel laden/anzeigen
articleSelectionButtons.forEach(button => {
  button.addEventListener('click', handleButtonClick);
});

async function handleButtonClick() {
  // Ladesymbol anzeigen
  this.classList.add(LOADING_CLASS);

  const target = parseInt(this.getAttribute('data-target'), 10);
  // Laden von Artikel 0 (erster Artikel) erlauben
  if (!target && target !== 0) return;

  // Warten bis Artikel geladen
  await goToArticle(target);

  // Dann Ladesymbol verstecken und Auswahl schließen
  this.classList.remove(LOADING_CLASS);
  closeArticleSelection();
}

// Bei Klick auf Artikelnummer die Auswahl öffnen
window.addEventListener('click', ({ target }) => {
  if (target.matches('.article__number')) openArticleSelection();
});

function openArticleSelection() {
  document.body.classList.add('no-overflow');
  articleSelection.classList.add('article-selection--open');
}

function closeArticleSelection() {
  document.body.classList.remove('no-overflow');
  articleSelection.classList.remove('article-selection--open');
}

// Observer, sorgt dafür dass alle sichtbaren Artikelauswahl-Elemente die
// active Klasse haben. Das jeweils oberste der Elemente mit active Klasse
// ist per CSS gehighlighted

// TODO: Umschreiben, Elemente müssen oben 'einrasten'
const handleIntersection = entries => {
  entries.forEach(entry => {
    const { target, isIntersecting } = entry;

    if (isIntersecting) target.classList.add(ACTIVE_CLASS);
    else target.classList.remove(ACTIVE_CLASS);
  });
};

const options = { rootMargin: '-70px 0px 0px 0px' };
const ButtonObserver = new IntersectionObserver(handleIntersection, options);
const observeButton = ButtonObserver.observe.bind(ButtonObserver);

articleSelectionButtons.forEach(observeButton);
