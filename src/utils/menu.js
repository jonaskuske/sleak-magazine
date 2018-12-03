import { $$ } from './';

const hamburgers = $$('.js-hamburger');
const menuItems = $$('.js-menu__item');

// Toggle menu when clicking on hamburger buttons
hamburgers.forEach(btn => btn.addEventListener('click', toggleMenu));
// Close menus after clicking a menu item
menuItems.forEach(item => item.addEventListener('click', closeMenu));

function toggleMenu() {
  document.body.classList.toggle('menu-open');
  document.documentElement.classList.toggle('no-overflow');
  setTimeout(() => document.body.classList.toggle('hamburger--x'), 20);
}

function closeMenu() {
  document.documentElement.classList.remove('no-overflow');
  document.body.classList.remove('menu-open');
  document.body.classList.remove('hamburger--x');
}
