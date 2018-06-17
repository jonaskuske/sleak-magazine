import './styles';

// IE workaround
if (!NodeList.prototype.forEach)
  NodeList.prototype.forEach = Array.prototype.forEach;

// HTML elements
const splash = document.querySelector('.js-splash');
const hamburger = document.querySelector('.js-hamburger');
const menu = document.querySelector('.js-menu');
const menuItems = document.querySelectorAll('.js-menu__item');
const main = document.querySelector('.js-main');

// scroll to content when clicking on splashscreen
splash.addEventListener('click', () => {
  main.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// handle menu items
hamburger.addEventListener('click', toggleMenu);
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
