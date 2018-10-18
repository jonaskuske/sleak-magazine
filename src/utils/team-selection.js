// vgl. article-selection.js

import { $ } from '.';

const teamSelection = $('.team-selection')[0];
const teamSelectionButtons = teamSelection.querySelectorAll(
  '.team-selection__button',
);

const ACTIVE_CLASS = 'team-selection__button--active';

teamSelectionButtons.forEach(button => {
  button.addEventListener('click', handleButtonClick);
});

function handleButtonClick() {
  const name = this.dataset.target;
  if (!name) return;

  document
    .querySelector(`#${name}`)
    .scrollIntoView({ behavior: 'smooth', block: 'start' });

  closeTeamSelection();
}

window.addEventListener('click', ({ target }) => {
  if (target.matches('.js-article__title--team')) openTeamSelection();
});

function openTeamSelection() {
  document.body.classList.add('no-overflow');
  teamSelection.classList.add('team-selection--open');
}

function closeTeamSelection() {
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

const options = { rootMargin: '-70px 0px 0px 0px' };
const ButtonObserver = new IntersectionObserver(handleIntersection, options);
const observeButton = ButtonObserver.observe.bind(ButtonObserver);

teamSelectionButtons.forEach(observeButton);
