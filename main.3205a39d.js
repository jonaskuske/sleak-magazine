parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"iWjG":[function(require,module,exports) {
"use strict";function e(e){return n(e)||r(e)||t()}function t(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function r(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function n(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.updateHash=exports.isCrawler=exports.debounce=exports.$$=exports.$=exports.throwError=exports.wait=void 0;var o=function(e){return new Promise(function(t){return setTimeout(t,e)})};exports.wait=o;var i=function(e){throw Error(e)};exports.throwError=i;var a=document.querySelector.bind(document);exports.$=a;var s=function(t){return e(document.querySelectorAll(t))};exports.$$=s;var u=function(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return function(){for(var n=this,o=arguments.length,i=new Array(o),a=0;a<o;a++)i[a]=arguments[a];clearTimeout(t),t=setTimeout(function(){t=null,e.apply(n,i)},r)}};exports.debounce=u;var c=/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);exports.isCrawler=c;var l=new Map([["zwischen-seemannsgarn-und-strandgut","🍺 Kneipentour, for science."],["bringt-farbe-in-die-stadt","⚽ Abenteuer in den Graffitiburgen."],["film-ab-bheaven","🛰 Doch gab es die Mondlandung wirklich?"],["back-to-print","🍪 Aber Print hat keine Cookies."],["projekt-antarktis","🐧 Pengwings."],["wie-ki-die-designwelt-aendert","🔴 I'm afraid I can't let you do that, Dave."],["jonas","✔ Perfekt, trotz Serifen."],["max","✔ Ist Photoshop, nicht Paint."]]),p=function(e){l.has(e)&&(console.log("\n".concat(l.get(e))),l.delete(e))},d=u(function(e,t){history.replaceState&&(p(e),history.replaceState(null,document.title,"#".concat(e))),t&&(document.title=t)},500);exports.updateHash=d;
},{}],"BcdU":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.startScrollObserver=s,exports.loadArticle=f,exports.default=exports.articles=void 0;var e=require("./");function t(e,t){return a(e)||n(e,t)||r()}function r(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function n(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var r=[],n=!0,a=!1,i=void 0;try{for(var o,u=e[Symbol.iterator]();!(n=(o=u.next()).done)&&(r.push(o.value),!t||r.length!==t);n=!0);}catch(c){a=!0,i=c}finally{try{n||null==u.return||u.return()}finally{if(a)throw i}}return r}}function a(e){if(Array.isArray(e))return e}var i=Promise.resolve(),o=(0,e.$$)(".article").map(function(e,t){return{element:e,index:t,name:e.id,title:!1,path:"./articles/".concat(e.id,".html"),inViewport:!1}});exports.articles=o;var u=function(e){return"number"==typeof e?o[e]:o.find(function(t){return t.name===e})},c=function(r){var n,a,i,o,u,c,l,s=arguments;return regeneratorRuntime.async(function(f){for(;;)switch(f.prev=f.next){case 0:return n=s.length>1&&void 0!==s[1]?s[1]:{},a=n.fromObserver,i=r.path,o=r.element,f.next=4,regeneratorRuntime.awrap(Promise.all([fetch(i).then(function(e){return e.text()}),a&&(0,e.wait)(1200)]));case 4:if(u=f.sent,c=t(u,1),l=c[0],"true"!==o.getAttribute("data-loaded")){f.next=9;break}return f.abrupt("return");case 9:return o.innerHTML=l,window.Stickyfill.addOne(o.querySelectorAll(".stickyfill")),o.setAttribute("data-loaded",!0),f.abrupt("return");case 13:case"end":return f.stop()}})},l=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return"true"===e.element.getAttribute("data-loaded")?Promise.resolve():t.fromObserver?i=i.then(function(){return e.inViewport?c(e,t):Promise.resolve()}):c(e)};function s(){var t=new IntersectionObserver(function(t){t.forEach(function(t){var r=u(t.target.id);if(r.inViewport=t.isIntersecting,r.inViewport)l(r,{fromObserver:!0}).then(function(){if(!r.title){var t=r.element.querySelector("h1"),n=t&&"".concat(t.textContent," – sleak");r.title=n}(0,e.updateHash)(r.name,r.title)});else{var n=o.find(function(e){return e.inViewport});n?(0,e.updateHash)(n.name,n.title):(0,e.updateHash)("","sleak – design magazine")}})},{rootMargin:"-1px 0px"});o.forEach(function(e){var r=e.element;return t.observe(r)})}function f(e){var t,r;return regeneratorRuntime.async(function(n){for(;;)switch(n.prev=n.next){case 0:if(t=u(e)){n.next=3;break}return n.abrupt("return");case 3:return r=o.filter(function(e,r){return r<=t.index}).map(l),n.prev=4,n.next=7,regeneratorRuntime.awrap(Promise.all(r));case 7:n.next=12;break;case 9:return n.prev=9,n.t0=n.catch(4),n.abrupt("return",console.error("Fehler beim Laden des Artikels ".concat(t.name,": ").concat(n.t0)));case 12:return n.abrupt("return",t);case 13:case"end":return n.stop()}},null,null,[[4,9]])}var p=f;exports.default=p;
},{"./":"iWjG"}],"HJDO":[function(require,module,exports) {
"use strict";var e=require("./utils"),t=require("./utils/load-article");function n(){var n,r,o,a,i,s;return regeneratorRuntime.async(function(c){for(;;)switch(c.prev=c.next){case 0:return Boolean("ontouchstart"in window||window.navigator.maxTouchPoints>0||window.navigator.msMaxTouchPoints>0||window.DocumentTouch&&document instanceof DocumentTouch)&&document.body.classList.add("supports-touch"),(n=function(){var e=.01*window.innerHeight;document.documentElement.style.setProperty("--vh","".concat(e,"px"))})(),window.addEventListener("resize",(0,e.debounce)(n,500)),r=(0,e.$)(".js-splash"),o=(0,e.$)(".js-main"),r.addEventListener("click",function(){o.scrollIntoView({behavior:"smooth",block:"start"})}),a=window.location.hash,i=a.slice(1),c.next=12,regeneratorRuntime.awrap((0,t.loadArticle)(i));case 12:if(s=c.sent){c.next=16;break}return c.next=16,regeneratorRuntime.awrap((0,t.loadArticle)(0));case 16:if(!e.isCrawler){c.next=19;break}return c.next=19,regeneratorRuntime.awrap((0,t.loadArticle)(t.articles.length-1));case 19:document.body.classList.remove("empty"),(0,t.startScrollObserver)(),window.Stickyfill.refreshAll(),s&&s.element.scrollIntoView({behavior:"smooth",block:"start"}),window.addEventListener("hashchange",function(){var e,n,r,o;return regeneratorRuntime.async(function(a){for(;;)switch(a.prev=a.next){case 0:if(e=window.location.hash,n=e.slice(1),!(r=document.getElementById(n))||"false"!==r.getAttribute("data-loaded")){a.next=10;break}return a.next=6,regeneratorRuntime.awrap((0,t.loadArticle)(n));case 6:if(o=a.sent){a.next=9;break}return a.abrupt("return");case 9:o.element.scrollIntoView({behavior:"smooth",block:"start"});case 10:case"end":return a.stop()}})});case 24:case"end":return c.stop()}})}window.onload=n;
},{"./utils":"iWjG","./utils/load-article":"BcdU"}]},{},["HJDO"], null)
//# sourceMappingURL=https://dmp-magazin.de/main.3205a39d.js.map