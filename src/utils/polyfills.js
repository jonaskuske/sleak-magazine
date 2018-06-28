import 'babel-polyfill';
import 'intersection-observer';
import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

// IE workaround
if (!NodeList.prototype.forEach)
  NodeList.prototype.forEach = Array.prototype.forEach;

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector;
}
