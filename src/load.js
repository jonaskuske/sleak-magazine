import $ from 'jquery';
import 'intersection-observer';
const articles = [
  { name: 'seemann' },
  { name: 'graffiti' },
  { name: 'apollo' },
  { name: 'kunst' },
  { name: 'nachbar' },
  { name: 'medien' },
  { name: 'stern' },
  { name: 'melanka' },
  { name: 'österreich' },
  { name: 'antarktis' },
  { name: 'ki' },
  { name: 'bertram' },
];

const insertToDom = article => {
  const { name } = article;
  const path = `./articles/${name}.html`;
  $(`#${name}`).load(path);
  article.loaded = true;
};

const loadArticle = article => {
  const targetArticle =
    typeof article === 'number'
      ? articles[article - 1]
      : articles.find(a => a.name === article);
  if (targetArticle.loaded) return console.log('returning...');

  insertToDom(targetArticle);
};

window.loadArticle = loadArticle;

const callback = function(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadArticle(entry.target.id);
    }
  });
};
const articleObserver = new IntersectionObserver(callback);
const articleList = [
  'seemann',
  'graffiti',
  'apollo',
  'kunst',
  'nachbar',
  'medien',
  'stern',
  'melanka',
  'österreich',
  'antarktis',
  'ki',
  'bertram',
];
articleList.forEach(articleId =>
  articleObserver.observe(document.getElementById(articleId)),
);
