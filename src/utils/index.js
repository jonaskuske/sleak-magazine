export const wait = t => new Promise(r => setTimeout(r, t));

export const $ = selector =>
  selector.startsWith('.')
    ? [...document.querySelectorAll(selector)]
    : document.querySelector(selector);
