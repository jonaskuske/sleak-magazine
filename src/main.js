import './styles';
import './utils/polyfills';
import loadArticle from './load-article';
import './article-selection';

// IE workaround
if (!NodeList.prototype.forEach)
  NodeList.prototype.forEach = Array.prototype.forEach;

// HTML elements
const splash = document.querySelector('.js-splash');
const hamburger = document.querySelector('.js-hamburger');
const menu = document.querySelector('.js-menu');
const menuItems = document.querySelectorAll('.js-menu__item');
const main = document.querySelector('.js-main');
const articleNumbers = document.querySelectorAll('.article__number');
const articleList = document.querySelector('.article-list');

const show = el => (el.style.display = 'block');
const hide = el => (el.style.display = 'none');

const showArticleList = () => show(articleList);

articleNumbers.forEach(el => el.addEventListener('click', showArticleList));

articleList.addEventListener('click', () => hide(articleList));

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

window.loadArticle = loadArticle;
