/**
 * Anchors point to /team, /print etc. instead of to /team.html or /print.html
 * Parcel's default devServer doesn't handle this so we need our own middleware
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const Bundler = require('parcel-bundler');
const fastGlob = require('fast-glob');
const chalk = require('chalk');
const app = express();

const PORT = 8080;

const { HTTPS_CERT, HTTPS_KEY } = process.env;
const httpsEnabled = Boolean(HTTPS_CERT && HTTPS_KEY);
const cert = httpsEnabled && path.join(process.cwd(), HTTPS_CERT);
const key = httpsEnabled && path.join(process.cwd(), HTTPS_KEY);

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
  open: true,
  contentHash: false,
  logLevel: 2,
  hmr: true,
  hmrPort: 8085,
  sourceMaps: true,
  https: httpsEnabled && { cert, key },
};

const bundler = new Bundler(entry, options);
const render = bundler.middleware();

app.use(({ url }, response, next) => {
  if (!aliases.has(url)) return next();

  response.sendFile(fromRoot('dist/' + aliases.get(url)));
});

if (httpsEnabled) {
  app.use((req, res, next) => {
    req.secure ? next() : res.redirect(`https://${req.headers.host}${req.url}`);
  }, render);

  const http = require('http');
  const https = require('https');
  http.createServer(app).listen(8081);
  const credential = { cert: fs.readFileSync(cert), key: fs.readFileSync(key) };
  https.createServer(credential, app).listen(8082);

  // https://stackoverflow.com/questions/22453782/nodejs-http-and-https-over-same-port
  const net = require('net');
  const redirectToHttpServer = connection => {
    connection.once('data', buffer => {
      // A TLS handshake record starts with byte 22.
      const address = buffer[0] === 22 ? 8082 : 8081;
      const proxy = net.createConnection(address, () => {
        proxy.write(buffer);
        connection.pipe(proxy).pipe(connection);
      });
    });
  };
  net.createServer(redirectToHttpServer).listen(PORT);
} else app.use(render).listen(PORT);
