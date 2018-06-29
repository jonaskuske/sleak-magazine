import { $ } from './utils';

// HTML Elemente
const teamSelection = $('.team-selection')[0];
const teamSelectionButtons = teamSelection.querySelectorAll(
  '.team-selection__button',
);

// CSS Klassen
const ACTIVE_CLASS = 'team-selection__button--active';

// Bei Klick
teamSelectionButtons.forEach(button => {
  button.addEventListener('click', handleButtonClick);
});

function handleButtonClick() {
  const name = this.dataset.target;
  if (!name) return;

  document
    .querySelector(`#${name}`)
    .scrollIntoView({ behavior: 'smooth', block: 'start' });

  closeArticleSelection();
}

// Bei Klick auf Artikelnummer die Auswahl öffnen
window.addEventListener('click', ({ target }) => {
  if (target.matches('.team__name')) openArticleSelection();
});

export function openArticleSelection() {
  document.body.classList.add('no-overflow');
  teamSelection.classList.add('team-selection--open');
}

export function closeArticleSelection() {
  document.body.classList.remove('no-overflow');
  teamSelection.classList.remove('team-selection--open');
}

const handleIntersection = entries => {
  entries.forEach(entry => {
    const { target, isIntersecting } = entry;

    if (isIntersecting) target.classList.add(ACTIVE_CLASS);
    else target.classList.remove(ACTIVE_CLASS);
  });
};

const observerOptions = {
  rootMargin: '-70px 0px 0px 0px',
};

const SelectionButtonOberserver = new IntersectionObserver(
  handleIntersection,
  observerOptions,
);
teamSelectionButtons.forEach(btn => SelectionButtonOberserver.observe(btn));
