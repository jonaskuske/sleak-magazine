parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"KIDt":[function(require,module,exports) {
!function(t,e){"use strict";var i=function(){function t(t,e){for(var i=0;i<e.length;i++){var o=e[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,i,o){return i&&t(e.prototype,i),o&&t(e,o),e}}();var o,n=!1,s=void 0!==t;s&&t.getComputedStyle?(o=e.createElement("div"),["","-webkit-","-moz-","-ms-"].some(function(t){try{o.style.position=t+"sticky"}catch(e){}return""!=o.style.position})&&(n=!0)):n=!0;var r=!1,a="undefined"!=typeof ShadowRoot,f={top:null,left:null},l=[];function h(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])}function d(t){return parseFloat(t)||0}function c(t){for(var e=0;t;)e+=t.offsetTop,t=t.offsetParent;return e}var p=function(){function o(t){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,o),!(t instanceof HTMLElement))throw new Error("First argument must be HTMLElement");if(l.some(function(e){return e._node===t}))throw new Error("Stickyfill is already applied to this node");this._node=t,this._stickyMode=null,this._active=!1,l.push(this),this.refresh()}return i(o,[{key:"refresh",value:function(){if(!n&&!this._removed){this._active&&this._deactivate();var i=this._node,o=getComputedStyle(i),s={position:o.position,top:o.top,display:o.display,marginTop:o.marginTop,marginBottom:o.marginBottom,marginLeft:o.marginLeft,marginRight:o.marginRight,cssFloat:o.cssFloat};if(!isNaN(parseFloat(s.top))&&"table-cell"!=s.display&&"none"!=s.display){this._active=!0;var r=i.style.position;"sticky"!=o.position&&"-webkit-sticky"!=o.position||(i.style.position="static");var f=i.parentNode,l=a&&f instanceof ShadowRoot?f.host:f,p=i.getBoundingClientRect(),u=l.getBoundingClientRect(),m=getComputedStyle(l);this._parent={node:l,styles:{position:l.style.position},offsetHeight:l.offsetHeight},this._offsetToWindow={left:p.left,right:e.documentElement.clientWidth-p.right},this._offsetToParent={top:p.top-u.top-d(m.borderTopWidth),left:p.left-u.left-d(m.borderLeftWidth),right:-p.right+u.right-d(m.borderRightWidth)},this._styles={position:r,top:i.style.top,bottom:i.style.bottom,left:i.style.left,right:i.style.right,width:i.style.width,marginTop:i.style.marginTop,marginLeft:i.style.marginLeft,marginRight:i.style.marginRight};var g=d(s.top);this._limits={start:p.top+t.pageYOffset-g,end:u.top+t.pageYOffset+l.offsetHeight-d(m.borderBottomWidth)-i.offsetHeight-g-d(s.marginBottom)};var _=m.position;"absolute"!=_&&"relative"!=_&&(l.style.position="relative"),this._recalcPosition();var v=this._clone={};v.node=e.createElement("div"),h(v.node.style,{width:p.right-p.left+"px",height:p.bottom-p.top+"px",marginTop:s.marginTop,marginBottom:s.marginBottom,marginLeft:s.marginLeft,marginRight:s.marginRight,cssFloat:s.cssFloat,padding:0,border:0,borderSpacing:0,fontSize:"1em",position:"static"}),f.insertBefore(v.node,i),v.docOffsetTop=c(v.node)}}}},{key:"_recalcPosition",value:function(){if(this._active&&!this._removed){var t=f.top<=this._limits.start?"start":f.top>=this._limits.end?"end":"middle";if(this._stickyMode!=t){switch(t){case"start":h(this._node.style,{position:"absolute",left:this._offsetToParent.left+"px",right:this._offsetToParent.right+"px",top:this._offsetToParent.top+"px",bottom:"auto",width:"auto",marginLeft:0,marginRight:0,marginTop:0});break;case"middle":h(this._node.style,{position:"fixed",left:this._offsetToWindow.left+"px",right:this._offsetToWindow.right+"px",top:this._styles.top,bottom:"auto",width:"auto",marginLeft:0,marginRight:0,marginTop:0});break;case"end":h(this._node.style,{position:"absolute",left:this._offsetToParent.left+"px",right:this._offsetToParent.right+"px",top:"auto",bottom:0,width:"auto",marginLeft:0,marginRight:0})}this._stickyMode=t}}}},{key:"_fastCheck",value:function(){this._active&&!this._removed&&(Math.abs(c(this._clone.node)-this._clone.docOffsetTop)>1||Math.abs(this._parent.node.offsetHeight-this._parent.offsetHeight)>1)&&this.refresh()}},{key:"_deactivate",value:function(){var t=this;this._active&&!this._removed&&(this._clone.node.parentNode.removeChild(this._clone.node),delete this._clone,h(this._node.style,this._styles),delete this._styles,l.some(function(e){return e!==t&&e._parent&&e._parent.node===t._parent.node})||h(this._parent.node.style,this._parent.styles),delete this._parent,this._stickyMode=null,this._active=!1,delete this._offsetToWindow,delete this._offsetToParent,delete this._limits)}},{key:"remove",value:function(){var t=this;this._deactivate(),l.some(function(e,i){if(e._node===t._node)return l.splice(i,1),!0}),this._removed=!0}}]),o}(),u={stickies:l,Sticky:p,forceSticky:function(){n=!1,m(),this.refreshAll()},addOne:function(t){if(!(t instanceof HTMLElement)){if(!t.length||!t[0])return;t=t[0]}for(var e=0;e<l.length;e++)if(l[e]._node===t)return l[e];return new p(t)},add:function(t){if(t instanceof HTMLElement&&(t=[t]),t.length){for(var e=[],i=function(i){var o=t[i];return o instanceof HTMLElement?l.some(function(t){if(t._node===o)return e.push(t),!0})?"continue":void e.push(new p(o)):(e.push(void 0),"continue")},o=0;o<t.length;o++)i(o);return e}},refreshAll:function(){l.forEach(function(t){return t.refresh()})},removeOne:function(t){if(!(t instanceof HTMLElement)){if(!t.length||!t[0])return;t=t[0]}l.some(function(e){if(e._node===t)return e.remove(),!0})},remove:function(t){if(t instanceof HTMLElement&&(t=[t]),t.length)for(var e=function(e){var i=t[e];l.some(function(t){if(t._node===i)return t.remove(),!0})},i=0;i<t.length;i++)e(i)},removeAll:function(){for(;l.length;)l[0].remove()}};function m(){if(!r){r=!0,s(),t.addEventListener("scroll",s),t.addEventListener("resize",u.refreshAll),t.addEventListener("orientationchange",u.refreshAll);var i=void 0,o=void 0,n=void 0;"hidden"in e?(o="hidden",n="visibilitychange"):"webkitHidden"in e&&(o="webkitHidden",n="webkitvisibilitychange"),n?(e[o]||a(),e.addEventListener(n,function(){e[o]?clearInterval(i):a()})):a()}function s(){t.pageXOffset!=f.left?(f.top=t.pageYOffset,f.left=t.pageXOffset,u.refreshAll()):t.pageYOffset!=f.top&&(f.top=t.pageYOffset,f.left=t.pageXOffset,l.forEach(function(t){return t._recalcPosition()}))}function a(){i=setInterval(function(){l.forEach(function(t){return t._fastCheck()})},500)}}n||m(),"undefined"!=typeof module&&module.exports?module.exports=u:s&&(t.Stickyfill=u)}(window,document);
},{}],"iWjG":[function(require,module,exports) {
"use strict";function e(e){return n(e)||r(e)||t()}function t(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function r(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function n(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.updateHash=exports.shrug=exports.debounce=exports.$$=exports.$=exports.throwError=exports.wait=void 0;var o=function(e){return new Promise(function(t){return setTimeout(t,e)})};exports.wait=o;var i=function(e){throw Error(e)};exports.throwError=i;var a=document.querySelector.bind(document);exports.$=a;var s=function(t){return e(document.querySelectorAll(t))};exports.$$=s;var u=function(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return function(){for(var n=this,o=arguments.length,i=new Array(o),a=0;a<o;a++)i[a]=arguments[a];clearTimeout(t),t=setTimeout(function(){t=null,e.apply(n,i)},r)}};exports.debounce=u;var c=new Map([["zwischen-seemannsgarn-und-strandgut","🍺 Kneipentour, for science."],["bringt-farbe-in-die-stadt","⚽ Abenteuer in den Graffitiburgen."],["film-ab-bheaven","🛰 Doch gab es die Mondlandung wirklich?"],["back-to-print","🍪 Aber Print hat keine Cookies."],["projekt-antarktis","🐧 Pengwings."],["wie-ki-die-designwelt-aendert","🔴 I'm afraid I can't let you do that, Dave."],["jonas","✔ Perfekt, trotz Serifen."],["max","✔ Ist Photoshop, nicht Paint."]]),l=function(e){c.has(e)&&(console.log("\n".concat(c.get(e))),c.delete(e))};exports.shrug=l;var p=u(function(e){history.replaceState&&(l(e),history.replaceState(null,document.title,"#".concat(e)))},500);exports.updateHash=p;
},{}],"3Bcd":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.startScrollObserver=v,exports.loadArticle=h,exports.default=void 0;var e=require("./"),r=t(require("stickyfilljs"));function t(e){return e&&e.__esModule?e:{default:e}}function n(e,r){return u(e)||i(e,r)||a()}function a(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function i(e,r){var t=[],n=!0,a=!1,i=void 0;try{for(var u,o=e[Symbol.iterator]();!(n=(u=o.next()).done)&&(t.push(u.value),!r||t.length!==r);n=!0);}catch(c){a=!0,i=c}finally{try{n||null==o.return||o.return()}finally{if(a)throw i}}return t}function u(e){if(Array.isArray(e))return e}function o(e,r,t,n,a,i,u){try{var o=e[i](u),c=o.value}catch(s){return void t(s)}o.done?r(c):Promise.resolve(c).then(n,a)}function c(e){return function(){var r=this,t=arguments;return new Promise(function(n,a){var i=e.apply(r,t);function u(e){o(i,n,a,u,c,"next",e)}function c(e){o(i,n,a,u,c,"throw",e)}u(void 0)})}}var s=Promise.resolve(),f=(0,e.$$)(".article").map(function(e,r){return{element:e,index:r,name:e.id,path:"./articles/".concat(e.id,".html"),inViewport:!1}}),l=function(e){return"number"==typeof e?f[e]:f.find(function(r){return r.name===e})},p=function(){var t=c(regeneratorRuntime.mark(function t(a){var i,u,o,c,s,f,l,p=arguments;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return i=p.length>1&&void 0!==p[1]?p[1]:{},u=i.fromObserver,o=a.path,c=a.element,t.next=4,Promise.all([fetch(o).then(function(e){return e.text()}),u&&(0,e.wait)(1200)]);case 4:if(s=t.sent,f=n(s,1),l=f[0],"true"!==c.getAttribute("data-loaded")){t.next=9;break}return t.abrupt("return");case 9:return c.innerHTML=l,r.default.addOne(c.querySelectorAll(".stickyfill")),c.setAttribute("data-loaded",!0),t.abrupt("return");case 13:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),d=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!("true"===e.element.getAttribute("data-loaded")))return r.fromObserver?s=s.then(function(){e.inViewport&&p(e,r)}):p(e)};function v(){var r=new IntersectionObserver(function(r){r.forEach(function(r){var t=l(r.target.id);if(t.inViewport=r.isIntersecting,t.inViewport)(0,e.updateHash)(t.name),d(t,{fromObserver:!0});else{var n=f.find(function(e){return e.inViewport});n?(0,e.updateHash)(n.name):location.hash&&(0,e.updateHash)("")}})},{rootMargin:"-1px 0px"});f.forEach(function(e){var t=e.element;return r.observe(t)})}function h(e){return m.apply(this,arguments)}function m(){return(m=c(regeneratorRuntime.mark(function e(r){var t,n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=l(r)){e.next=3;break}return e.abrupt("return");case 3:return n=f.filter(function(e,r){return r<=t.index}).map(d),e.prev=4,e.next=7,Promise.all(n);case 7:e.next=12;break;case 9:return e.prev=9,e.t0=e.catch(4),e.abrupt("return",console.error("Fehler beim Laden des Artikels ".concat(t.name,": ").concat(e.t0)));case 12:return e.abrupt("return",t);case 13:case"end":return e.stop()}},e,this,[[4,9]])}))).apply(this,arguments)}var b=h;exports.default=b;
},{"./":"iWjG","stickyfilljs":"KIDt"}],"HJD/":[function(require,module,exports) {
"use strict";var e=r(require("stickyfilljs")),t=require("./utils"),n=require("./utils/load-article");function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n,r,o,i,a){try{var s=e[i](a),c=s.value}catch(u){return void n(u)}s.done?t(c):Promise.resolve(c).then(r,o)}function i(e){return function(){var t=this,n=arguments;return new Promise(function(r,i){var a=e.apply(t,n);function s(e){o(a,r,i,s,c,"next",e)}function c(e){o(a,r,i,s,c,"throw",e)}s(void 0)})}}function a(){return s.apply(this,arguments)}function s(){return(s=i(regeneratorRuntime.mark(function r(){var o,a,s,c,u,l;return regeneratorRuntime.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return Boolean("ontouchstart"in window||window.navigator.maxTouchPoints>0||window.navigator.msMaxTouchPoints>0||window.DocumentTouch&&document instanceof DocumentTouch)&&document.body.classList.add("supports-touch"),(o=function(){var e=.01*window.innerHeight;document.documentElement.style.setProperty("--vh","".concat(e,"px"))})(),window.addEventListener("resize",(0,t.debounce)(o,500)),a=(0,t.$)(".js-splash"),s=(0,t.$)(".js-main"),a.addEventListener("click",function(){s.scrollIntoView({behavior:"smooth",block:"start"})}),c=window.location.hash,u=c.slice(1),r.next=12,(0,n.loadArticle)(u);case 12:if(l=r.sent){r.next=16;break}return r.next=16,(0,n.loadArticle)(0);case 16:document.body.classList.remove("empty"),(0,n.startScrollObserver)(),e.default.refreshAll(),l&&l.element.scrollIntoView({behavior:"smooth",block:"start"}),window.addEventListener("hashchange",i(regeneratorRuntime.mark(function e(){var t,r,o,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=window.location.hash,r=t.slice(1),!(o=document.getElementById(r))||"false"!==o.getAttribute("data-loaded")){e.next=10;break}return e.next=6,(0,n.loadArticle)(window.location.hash.slice(1));case 6:if(i=e.sent){e.next=9;break}return e.abrupt("return");case 9:i.element.scrollIntoView({behavior:"smooth",block:"start"});case 10:case"end":return e.stop()}},e,this)})));case 21:case"end":return r.stop()}},r,this)}))).apply(this,arguments)}setTimeout(a,0);
},{"stickyfilljs":"KIDt","./utils":"iWjG","./utils/load-article":"3Bcd"}]},{},["HJD/"], null)
//# sourceMappingURL=https://sleak-mag.design/main.89583890.map