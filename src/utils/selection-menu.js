import { $, wait } from './index';
import { loadArticle } from './load-article';

(() => {
  // Container des Auswahl-Menüs
  const container = $('.selection-menu');
  if (!container) return;

  // Bei Klick auf Link innerhalb des Menüs das Menü wieder schließen
  container.addEventListener('click', async event => {
    const anchor = event.target.closest('a');
    if (!anchor) return;

    const targetId = anchor.hash.slice(1);
    const anchorTarget = document.getElementById(targetId);

    if (anchorTarget && anchorTarget.getAttribute('data-loaded') === 'false') {
      event.stopPropagation();
      event.preventDefault();
      anchor.classList.add('selection-menu--loading');
      await loadArticle(targetId);
      await wait(400);
      anchor.classList.remove('selection-menu--loading');
      anchor.click();
    } else closeSelectionMenu();
  });

  let prevHref;
  container.addEventListener('mouseover', ({ target }) => {
    const anchor = target.closest('a');
    if (anchor && anchor.href !== prevHref) {
      prevHref = anchor.href;
      container.classList.add('hover');
    }
  });

  container.addEventListener('mouseout', ({ target }) => {
    const anchor = target.closest('a');
    if (anchor && anchor.href === prevHref) {
      prevHref = undefined;
      container.classList.remove('hover');
    }
  });

  // Bei Klick auf entsprechenden Button das Menü öffnen
  window.addEventListener('click', ({ target }) => {
    if (target.matches('.js-to-selection-menu')) {
      const article = target.closest('.article');
      openSelectionMenu(article && article.id);
    }
    if (!!target.closest('.js-close-selection-menu')) {
      closeSelectionMenu();
    }
  });

  function closeSelectionMenu() {
    document.documentElement.classList.remove('no-overflow');
    document.body.classList.remove('hamburger--x');
    container.classList.remove('selection-menu--open');
  }

  function openSelectionMenu(fromId) {
    document.documentElement.classList.add('no-overflow');
    setTimeout(() => document.body.classList.add('hamburger--x'), 20);
    container.classList.add('selection-menu--open');

    const matchingAnchor = $(`a[href*="${fromId}"]`);
    if (matchingAnchor) matchingAnchor.focus();
  }
})();
