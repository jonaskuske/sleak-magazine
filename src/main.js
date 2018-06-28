import './assets/styles';
import './utils/polyfills';
import './article-selection';

import { $ } from './utils';
import { startScrollObserver } from './utils/load-article';

// Startet Observer, um Artikel nachzuladen, wenn Ende der Seite erreicht wird
startScrollObserver();

// HTML Elemente
const splash = $('.js-splash')[0];
const main = $('.js-main')[0];
const hamburger = $('.js-hamburger')[0];
const menu = $('.js-menu')[0];
const menuItems = $('.js-menu__item');

// Bei Klick auf Splashscreen zu Content scrollen
splash.addEventListener('click', () => {
  main.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Menü durch Hamburger-Button togglen
hamburger.addEventListener('click', toggleMenu);
// Menü nach klick auf beliebiges Menüelement schließen
menuItems.forEach(item => item.addEventListener('click', closeMenu));

function toggleMenu() {
  hamburger.classList.toggle('is-active');
  menu.classList.toggle('menu--open');
  document.body.classList.toggle('no-overflow');
}

function closeMenu() {
  hamburger.classList.remove('is-active');
  menu.classList.remove('menu--open');
  document.body.classList.remove('no-overflow');
}
