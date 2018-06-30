import './utils/polyfills';
import './assets/styles';
import './team-selection';

import { $ } from './utils';

// HTML Elemente
const hamburger = $('.js-hamburger')[0];
const menu = $('.js-menu')[0];
const menuItems = $('.js-menu__item');

// Menü durch Hamburger-Button togglen
hamburger.addEventListener('click', toggleMenu);
// Menü nach Klick auf beliebiges Menüelement schließen
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
