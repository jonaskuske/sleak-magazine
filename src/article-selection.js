import { $ } from './utils';
import loadArticle from './load-article';

const select = $('.article-selection')[0];

const buttons = select.querySelectorAll('button');

buttons.forEach(button =>
  button.addEventListener('click', () => {
    const number = button.textContent.split(' ')[1];
    loadArticle(parseInt(number));
    select.classList.remove('article-selection--open');
  }),
);
