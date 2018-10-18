// Promise, die sich nach gegebener Zeit erfüllt
export const wait = time => new Promise(resolve => setTimeout(resolve, time));

// Liefert Array falls Selektor mit "." (Klasse), ansonsten Node
export const $ = selector =>
  selector.startsWith('.')
    ? [...document.querySelectorAll(selector)]
    : document.querySelector(selector);

// Debounce: Tool, um eine Funktion erst auszuführen,
// wenn sie eine Zeit lang nicht ausgeführt wurde
export const debounce = (fn, wait = 0) => {
  let timeout;

  return function(...args) {
    const later = () => {
      timeout = null;
      fn.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
