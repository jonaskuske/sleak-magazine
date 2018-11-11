import 'babel-polyfill';
import 'intersection-observer';
import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';
import 'smoothscroll-anchor-polyfill';
import Stickyfill from 'stickyfilljs';

smoothscroll.polyfill();

Stickyfill.add(document.querySelectorAll('.stickyfill'));

// IE workarounds
if (!NodeList.prototype.forEach)
  NodeList.prototype.forEach = Array.prototype.forEach;

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector;
}
