import '@babel/polyfill';
import 'intersection-observer';
import 'element-closest';
import 'focus-visible';
import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';
import 'smoothscroll-anchor-polyfill';
import Stickyfill from 'stickyfilljs';

smoothscroll.polyfill();

Stickyfill.add(document.querySelectorAll('.stickyfill'));
// Bind stickyfill methods to window, so main.js entry point can access it
// and doesn't have to import its own Stickyfill module instance
window.refreshStickyfill = Stickyfill.refreshAll;
window.addOneStickyfill = Stickyfill.addOne;

// Pretty cheap workaround for NodeList.forEach() 🔮
if (!NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
