import $ from 'jquery';
import 'intersection-observer';
const articles = [{ name: 'test' }, { name: 'antarktis' }, { name: '' }];

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
const observer = new IntersectionObserver(callback);
// const antarktis = document.querySelector('#antarktis');
// console.log(antarktis);
// observer.observe(antarktis);

const articleList = ['seemann', 'graffiti', 'apollo', 'kunst', ''];
articleList.forEach(article =>
  observer.observe(document.getElementById(article)),
);
