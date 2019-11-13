import 'core-js';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import applyElementClosest from 'element-closest';
import smoothscroll from 'smoothscroll-polyfill';
import 'smoothscroll-anchor-polyfill/dist/index.min.js';
import Stickyfill from 'stickyfilljs';

applyElementClosest(window);

if (!window.fetch) {
  let fetchPolyfill;
  window.fetch = function(...args) {
    if (fetchPolyfill) return fetchPolyfill(...args);
    return import('whatwg-fetch').then(m => (fetchPolyfill = m.fetch)(...args));
  };
}

try {
  document.querySelector(':focus-visible');
} catch (_) {
  import('focus-visible').then(() => {});
}

smoothscroll.polyfill();

Stickyfill.add(document.querySelectorAll('.stickyfill'));
// Bind stickyfill to window, so main.js entry point can access it
// and doesn't have to import its own Stickyfill module instance
window.Stickyfill = Stickyfill;

// Cheap workarounds
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}
if (!NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
