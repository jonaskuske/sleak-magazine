/**
 * Anchors point to /team, /print etc. instead of to /team.html or /print.html
 * Parcel's default devServer doesn't handle this so we need our own middleware
 */

const path = require('path');
const express = require('express');
const Bundler = require('parcel-bundler');
const fastGlob = require('fast-glob');
const chalk = require('chalk');
const app = express();

const fromRoot = file => path.resolve(__dirname, '../', file);

const aliases = new Map();
fastGlob
  .sync('*.html')
  .filter(html => html !== 'index.html')
  .forEach(html => {
    const route = '/' + html.replace('.html', '');
    aliases.set(route, html);
  });

console.log(chalk`ℹ {bold.yellow Using Aliases for:\n }`);
console.log(aliases);
console.log('\n');

const entry = fromRoot('index.html');

const options = {
  watch: true,
  cache: false,
  contentHash: false,
  logLevel: 2,
  hmr: true,
  hmrPort: 8081,
  sourceMaps: true,
};

const bundler = new Bundler(entry, options);

app.use(({ url }, response, next) => {
  if (!aliases.has(url)) return next();

  response.sendFile(fromRoot('dist/' + aliases.get(url)));
});

app.use(bundler.middleware());

app.listen(8080);
