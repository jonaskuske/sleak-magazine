import { $$ } from './';

const hamburgers = $$('.js-hamburger');
const menuItems = $$('.js-menu__item');

// Menü durch Hamburger-Button togglen
hamburgers.forEach(btn => btn.addEventListener('click', toggleMenu));
// Menü nach Klick auf beliebiges Menüelement schließen
menuItems.forEach(item => item.addEventListener('click', closeMenu));

function toggleMenu() {
  document.body.classList.toggle('menu-open');
  document.body.classList.toggle('no-overflow');
  setTimeout(() => document.body.classList.toggle('hamburger-x'), 20);
}

function closeMenu() {
  document.body.classList.remove('no-overflow');
  document.body.classList.remove('menu-open');
  document.body.classList.remove('hamburger-x');
}
