import $ from 'jquery'

const articles = [
  { name: 'test', },
  { name: '', },
  { name: '', },
];


const insertToDom = article => {
  const { name } = article
  const path = `./articles/${name}.html`

  $(name).load(path)
  article.loaded = true
}

const loadArticle = article => {
  const targetArticle =
    typeof article === 'number'
      ? articles[article + 1]
      : articles.find(a => a.name === article);
console.log('found article:' + targetArticle)
  if (targetArticle.loaded) return console.log('returning...');

  // laaaaden!
  insertToDom(targetArticle)
};

window.loadArticle = loadArticle