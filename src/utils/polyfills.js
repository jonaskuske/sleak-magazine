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

if (!NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
