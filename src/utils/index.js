// Promise, die sich nach gegebener Zeit erfüllt
export const wait = time => new Promise(resolve => setTimeout(resolve, time));

// Liefert Array falls Selektor mit "." (Klasse), ansonsten Node
export const $ = selector =>
  selector.startsWith('.')
    ? [...document.querySelectorAll(selector)]
    : document.querySelector(selector);
