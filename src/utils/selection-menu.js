import { $, wait } from './index';
import { loadArticle } from './load-article';

(() => {
  // Container of the selection menu
  const container = $('.selection-menu');
  if (!container) return;

  // When clicking a menu item: close the menu / load referenced article
  container.addEventListener('click', async event => {
    const anchor = event.target.closest('a');
    if (!anchor) return;

    const targetId = anchor.hash.slice(1);
    const anchorTarget = document.getElementById(targetId);

    // Clicked anchor references a (not yet loaded) article?
    // Load it, then click the anchor again – now it'll reference an already
    // loaded article and the else-block is triggered
    if (anchorTarget && anchorTarget.getAttribute('data-loaded') === 'false') {
      event.stopPropagation();
      event.preventDefault();
      anchor.classList.add('selection-menu--loading');
      await loadArticle(targetId);
      await wait(400);
      anchor.classList.remove('selection-menu--loading');
      anchor.click();
      // Else: Just close the menu
    } else closeSelectionMenu();
  });

  /*
    --- ---
    Listeners for handling hovering, so we can only show focus styles
    if no other element is being hovered over
  */
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
  /* --- --- */

  // Click listener for toggling the selection menu
  window.addEventListener('click', ({ target }) => {
    // When clicking a button with class open-selection-menu:
    // open it and pass the id of the containing article, if avaible
    if (target.matches('.js-to-selection-menu')) {
      const article = target.closest('.article');
      openSelectionMenu(article && article.id);
    }
    // If it has class close-selection-menu: close it
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
    // Open selection menu
    document.documentElement.classList.add('no-overflow');
    setTimeout(() => document.body.classList.add('hamburger--x'), 20);
    container.classList.add('selection-menu--open');

    // Opened from within an article?
    // Focus the anchor pointing to said article immediately after opening
    const matchingAnchor = $(`a[href*="${fromId}"]`);
    if (matchingAnchor) matchingAnchor.focus();
  }
})();
