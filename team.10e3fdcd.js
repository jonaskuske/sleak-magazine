parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"iWjG":[function(require,module,exports) {
"use strict";function e(e){return n(e)||r(e)||t()}function t(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function r(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function n(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.updateHash=exports.isCrawler=exports.debounce=exports.$$=exports.$=exports.throwError=exports.wait=void 0;var o=function(e){return new Promise(function(t){return setTimeout(t,e)})};exports.wait=o;var i=function(e){throw Error(e)};exports.throwError=i;var a=document.querySelector.bind(document);exports.$=a;var s=function(t){return e(document.querySelectorAll(t))};exports.$$=s;var u=function(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return function(){for(var n=this,o=arguments.length,i=new Array(o),a=0;a<o;a++)i[a]=arguments[a];clearTimeout(t),t=setTimeout(function(){t=null,e.apply(n,i)},r)}};exports.debounce=u;var c=/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);exports.isCrawler=c;var l=new Map([["zwischen-seemannsgarn-und-strandgut","🍺 Kneipentour, for science."],["bringt-farbe-in-die-stadt","⚽ Abenteuer in den Graffitiburgen."],["film-ab-bheaven","🛰 Doch gab es die Mondlandung wirklich?"],["back-to-print","🍪 Aber Print hat keine Cookies."],["projekt-antarktis","🐧 Pengwings."],["wie-ki-die-designwelt-aendert","🔴 I'm afraid I can't let you do that, Dave."],["jonas","✔ Perfekt, trotz Serifen."],["max","✔ Ist Photoshop, nicht Paint."]]),p=function(e){l.has(e)&&(console.log("\n".concat(l.get(e))),l.delete(e))},d=u(function(e,t){history.replaceState&&(p(e),history.replaceState(null,document.title,"#".concat(e))),t&&(document.title=t)},500);exports.updateHash=d;
},{}],"EpKj":[function(require,module,exports) {
"use strict";var e=require("./utils"),i=function(){var i=(0,e.$$)("article .team__image"),r=new IntersectionObserver(function(i){i.forEach(function(i){var r=i.target;if(i.isIntersecting){var t=r.closest("article");(0,e.updateHash)(t.id),t.classList.add("show-image")}})},{rootMargin:"-1px 0px"}),t=r.observe.bind(r);i.forEach(t)};window.onload=i;
},{"./utils":"iWjG"}]},{},["EpKj"], null)
//# sourceMappingURL=https://dmp-magazin.de/team.10e3fdcd.map