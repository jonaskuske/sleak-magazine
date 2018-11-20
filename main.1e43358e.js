// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/stickyfilljs/dist/stickyfill.js":[function(require,module,exports) {
/*!
  * Stickyfill – `position: sticky` polyfill
  * v. 2.1.0 | https://github.com/wilddeer/stickyfill
  * MIT License
  */

;(function(window, document) {
    'use strict';
    
    /*
     * 1. Check if the browser supports `position: sticky` natively or is too old to run the polyfill.
     *    If either of these is the case set `seppuku` flag. It will be checked later to disable key features
     *    of the polyfill, but the API will remain functional to avoid breaking things.
     */
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var seppuku = false;
    
    var isWindowDefined = typeof window !== 'undefined';
    
    // The polyfill can’t function properly without `window` or `window.getComputedStyle`.
    if (!isWindowDefined || !window.getComputedStyle) seppuku = true;
    // Dont’t get in a way if the browser supports `position: sticky` natively.
    else {
            (function () {
                var testNode = document.createElement('div');
    
                if (['', '-webkit-', '-moz-', '-ms-'].some(function (prefix) {
                    try {
                        testNode.style.position = prefix + 'sticky';
                    } catch (e) {}
    
                    return testNode.style.position != '';
                })) seppuku = true;
            })();
        }
    
    /*
     * 2. “Global” vars used across the polyfill
     */
    var isInitialized = false;
    
    // Check if Shadow Root constructor exists to make further checks simpler
    var shadowRootExists = typeof ShadowRoot !== 'undefined';
    
    // Last saved scroll position
    var scroll = {
        top: null,
        left: null
    };
    
    // Array of created Sticky instances
    var stickies = [];
    
    /*
     * 3. Utility functions
     */
    function extend(targetObj, sourceObject) {
        for (var key in sourceObject) {
            if (sourceObject.hasOwnProperty(key)) {
                targetObj[key] = sourceObject[key];
            }
        }
    }
    
    function parseNumeric(val) {
        return parseFloat(val) || 0;
    }
    
    function getDocOffsetTop(node) {
        var docOffsetTop = 0;
    
        while (node) {
            docOffsetTop += node.offsetTop;
            node = node.offsetParent;
        }
    
        return docOffsetTop;
    }
    
    /*
     * 4. Sticky class
     */
    
    var Sticky = function () {
        function Sticky(node) {
            _classCallCheck(this, Sticky);
    
            if (!(node instanceof HTMLElement)) throw new Error('First argument must be HTMLElement');
            if (stickies.some(function (sticky) {
                return sticky._node === node;
            })) throw new Error('Stickyfill is already applied to this node');
    
            this._node = node;
            this._stickyMode = null;
            this._active = false;
    
            stickies.push(this);
    
            this.refresh();
        }
    
        _createClass(Sticky, [{
            key: 'refresh',
            value: function refresh() {
                if (seppuku || this._removed) return;
                if (this._active) this._deactivate();
    
                var node = this._node;
    
                /*
                 * 1. Save node computed props
                 */
                var nodeComputedStyle = getComputedStyle(node);
                var nodeComputedProps = {
                    position: nodeComputedStyle.position,
                    top: nodeComputedStyle.top,
                    display: nodeComputedStyle.display,
                    marginTop: nodeComputedStyle.marginTop,
                    marginBottom: nodeComputedStyle.marginBottom,
                    marginLeft: nodeComputedStyle.marginLeft,
                    marginRight: nodeComputedStyle.marginRight,
                    cssFloat: nodeComputedStyle.cssFloat
                };
    
                /*
                 * 2. Check if the node can be activated
                 */
                if (isNaN(parseFloat(nodeComputedProps.top)) || nodeComputedProps.display == 'table-cell' || nodeComputedProps.display == 'none') return;
    
                this._active = true;
    
                /*
                 * 3. Check if the current node position is `sticky`. If it is, it means that the browser supports sticky positioning,
                 *    but the polyfill was force-enabled. We set the node’s position to `static` before continuing, so that the node
                 *    is in it’s initial position when we gather its params.
                 */
                var originalPosition = node.style.position;
                if (nodeComputedStyle.position == 'sticky' || nodeComputedStyle.position == '-webkit-sticky') node.style.position = 'static';
    
                /*
                 * 4. Get necessary node parameters
                 */
                var referenceNode = node.parentNode;
                var parentNode = shadowRootExists && referenceNode instanceof ShadowRoot ? referenceNode.host : referenceNode;
                var nodeWinOffset = node.getBoundingClientRect();
                var parentWinOffset = parentNode.getBoundingClientRect();
                var parentComputedStyle = getComputedStyle(parentNode);
    
                this._parent = {
                    node: parentNode,
                    styles: {
                        position: parentNode.style.position
                    },
                    offsetHeight: parentNode.offsetHeight
                };
                this._offsetToWindow = {
                    left: nodeWinOffset.left,
                    right: document.documentElement.clientWidth - nodeWinOffset.right
                };
                this._offsetToParent = {
                    top: nodeWinOffset.top - parentWinOffset.top - parseNumeric(parentComputedStyle.borderTopWidth),
                    left: nodeWinOffset.left - parentWinOffset.left - parseNumeric(parentComputedStyle.borderLeftWidth),
                    right: -nodeWinOffset.right + parentWinOffset.right - parseNumeric(parentComputedStyle.borderRightWidth)
                };
                this._styles = {
                    position: originalPosition,
                    top: node.style.top,
                    bottom: node.style.bottom,
                    left: node.style.left,
                    right: node.style.right,
                    width: node.style.width,
                    marginTop: node.style.marginTop,
                    marginLeft: node.style.marginLeft,
                    marginRight: node.style.marginRight
                };
    
                var nodeTopValue = parseNumeric(nodeComputedProps.top);
                this._limits = {
                    start: nodeWinOffset.top + window.pageYOffset - nodeTopValue,
                    end: parentWinOffset.top + window.pageYOffset + parentNode.offsetHeight - parseNumeric(parentComputedStyle.borderBottomWidth) - node.offsetHeight - nodeTopValue - parseNumeric(nodeComputedProps.marginBottom)
                };
    
                /*
                 * 5. Ensure that the node will be positioned relatively to the parent node
                 */
                var parentPosition = parentComputedStyle.position;
    
                if (parentPosition != 'absolute' && parentPosition != 'relative') {
                    parentNode.style.position = 'relative';
                }
    
                /*
                 * 6. Recalc node position.
                 *    It’s important to do this before clone injection to avoid scrolling bug in Chrome.
                 */
                this._recalcPosition();
    
                /*
                 * 7. Create a clone
                 */
                var clone = this._clone = {};
                clone.node = document.createElement('div');
    
                // Apply styles to the clone
                extend(clone.node.style, {
                    width: nodeWinOffset.right - nodeWinOffset.left + 'px',
                    height: nodeWinOffset.bottom - nodeWinOffset.top + 'px',
                    marginTop: nodeComputedProps.marginTop,
                    marginBottom: nodeComputedProps.marginBottom,
                    marginLeft: nodeComputedProps.marginLeft,
                    marginRight: nodeComputedProps.marginRight,
                    cssFloat: nodeComputedProps.cssFloat,
                    padding: 0,
                    border: 0,
                    borderSpacing: 0,
                    fontSize: '1em',
                    position: 'static'
                });
    
                referenceNode.insertBefore(clone.node, node);
                clone.docOffsetTop = getDocOffsetTop(clone.node);
            }
        }, {
            key: '_recalcPosition',
            value: function _recalcPosition() {
                if (!this._active || this._removed) return;
    
                var stickyMode = scroll.top <= this._limits.start ? 'start' : scroll.top >= this._limits.end ? 'end' : 'middle';
    
                if (this._stickyMode == stickyMode) return;
    
                switch (stickyMode) {
                    case 'start':
                        extend(this._node.style, {
                            position: 'absolute',
                            left: this._offsetToParent.left + 'px',
                            right: this._offsetToParent.right + 'px',
                            top: this._offsetToParent.top + 'px',
                            bottom: 'auto',
                            width: 'auto',
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: 0
                        });
                        break;
    
                    case 'middle':
                        extend(this._node.style, {
                            position: 'fixed',
                            left: this._offsetToWindow.left + 'px',
                            right: this._offsetToWindow.right + 'px',
                            top: this._styles.top,
                            bottom: 'auto',
                            width: 'auto',
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: 0
                        });
                        break;
    
                    case 'end':
                        extend(this._node.style, {
                            position: 'absolute',
                            left: this._offsetToParent.left + 'px',
                            right: this._offsetToParent.right + 'px',
                            top: 'auto',
                            bottom: 0,
                            width: 'auto',
                            marginLeft: 0,
                            marginRight: 0
                        });
                        break;
                }
    
                this._stickyMode = stickyMode;
            }
        }, {
            key: '_fastCheck',
            value: function _fastCheck() {
                if (!this._active || this._removed) return;
    
                if (Math.abs(getDocOffsetTop(this._clone.node) - this._clone.docOffsetTop) > 1 || Math.abs(this._parent.node.offsetHeight - this._parent.offsetHeight) > 1) this.refresh();
            }
        }, {
            key: '_deactivate',
            value: function _deactivate() {
                var _this = this;
    
                if (!this._active || this._removed) return;
    
                this._clone.node.parentNode.removeChild(this._clone.node);
                delete this._clone;
    
                extend(this._node.style, this._styles);
                delete this._styles;
    
                // Check whether element’s parent node is used by other stickies.
                // If not, restore parent node’s styles.
                if (!stickies.some(function (sticky) {
                    return sticky !== _this && sticky._parent && sticky._parent.node === _this._parent.node;
                })) {
                    extend(this._parent.node.style, this._parent.styles);
                }
                delete this._parent;
    
                this._stickyMode = null;
                this._active = false;
    
                delete this._offsetToWindow;
                delete this._offsetToParent;
                delete this._limits;
            }
        }, {
            key: 'remove',
            value: function remove() {
                var _this2 = this;
    
                this._deactivate();
    
                stickies.some(function (sticky, index) {
                    if (sticky._node === _this2._node) {
                        stickies.splice(index, 1);
                        return true;
                    }
                });
    
                this._removed = true;
            }
        }]);
    
        return Sticky;
    }();
    
    /*
     * 5. Stickyfill API
     */
    
    
    var Stickyfill = {
        stickies: stickies,
        Sticky: Sticky,
    
        forceSticky: function forceSticky() {
            seppuku = false;
            init();
    
            this.refreshAll();
        },
        addOne: function addOne(node) {
            // Check whether it’s a node
            if (!(node instanceof HTMLElement)) {
                // Maybe it’s a node list of some sort?
                // Take first node from the list then
                if (node.length && node[0]) node = node[0];else return;
            }
    
            // Check if Stickyfill is already applied to the node
            // and return existing sticky
            for (var i = 0; i < stickies.length; i++) {
                if (stickies[i]._node === node) return stickies[i];
            }
    
            // Create and return new sticky
            return new Sticky(node);
        },
        add: function add(nodeList) {
            // If it’s a node make an array of one node
            if (nodeList instanceof HTMLElement) nodeList = [nodeList];
            // Check if the argument is an iterable of some sort
            if (!nodeList.length) return;
    
            // Add every element as a sticky and return an array of created Sticky instances
            var addedStickies = [];
    
            var _loop = function _loop(i) {
                var node = nodeList[i];
    
                // If it’s not an HTMLElement – create an empty element to preserve 1-to-1
                // correlation with input list
                if (!(node instanceof HTMLElement)) {
                    addedStickies.push(void 0);
                    return 'continue';
                }
    
                // If Stickyfill is already applied to the node
                // add existing sticky
                if (stickies.some(function (sticky) {
                    if (sticky._node === node) {
                        addedStickies.push(sticky);
                        return true;
                    }
                })) return 'continue';
    
                // Create and add new sticky
                addedStickies.push(new Sticky(node));
            };
    
            for (var i = 0; i < nodeList.length; i++) {
                var _ret2 = _loop(i);
    
                if (_ret2 === 'continue') continue;
            }
    
            return addedStickies;
        },
        refreshAll: function refreshAll() {
            stickies.forEach(function (sticky) {
                return sticky.refresh();
            });
        },
        removeOne: function removeOne(node) {
            // Check whether it’s a node
            if (!(node instanceof HTMLElement)) {
                // Maybe it’s a node list of some sort?
                // Take first node from the list then
                if (node.length && node[0]) node = node[0];else return;
            }
    
            // Remove the stickies bound to the nodes in the list
            stickies.some(function (sticky) {
                if (sticky._node === node) {
                    sticky.remove();
                    return true;
                }
            });
        },
        remove: function remove(nodeList) {
            // If it’s a node make an array of one node
            if (nodeList instanceof HTMLElement) nodeList = [nodeList];
            // Check if the argument is an iterable of some sort
            if (!nodeList.length) return;
    
            // Remove the stickies bound to the nodes in the list
    
            var _loop2 = function _loop2(i) {
                var node = nodeList[i];
    
                stickies.some(function (sticky) {
                    if (sticky._node === node) {
                        sticky.remove();
                        return true;
                    }
                });
            };
    
            for (var i = 0; i < nodeList.length; i++) {
                _loop2(i);
            }
        },
        removeAll: function removeAll() {
            while (stickies.length) {
                stickies[0].remove();
            }
        }
    };
    
    /*
     * 6. Setup events (unless the polyfill was disabled)
     */
    function init() {
        if (isInitialized) {
            return;
        }
    
        isInitialized = true;
    
        // Watch for scroll position changes and trigger recalc/refresh if needed
        function checkScroll() {
            if (window.pageXOffset != scroll.left) {
                scroll.top = window.pageYOffset;
                scroll.left = window.pageXOffset;
    
                Stickyfill.refreshAll();
            } else if (window.pageYOffset != scroll.top) {
                scroll.top = window.pageYOffset;
                scroll.left = window.pageXOffset;
    
                // recalc position for all stickies
                stickies.forEach(function (sticky) {
                    return sticky._recalcPosition();
                });
            }
        }
    
        checkScroll();
        window.addEventListener('scroll', checkScroll);
    
        // Watch for window resizes and device orientation changes and trigger refresh
        window.addEventListener('resize', Stickyfill.refreshAll);
        window.addEventListener('orientationchange', Stickyfill.refreshAll);
    
        //Fast dirty check for layout changes every 500ms
        var fastCheckTimer = void 0;
    
        function startFastCheckTimer() {
            fastCheckTimer = setInterval(function () {
                stickies.forEach(function (sticky) {
                    return sticky._fastCheck();
                });
            }, 500);
        }
    
        function stopFastCheckTimer() {
            clearInterval(fastCheckTimer);
        }
    
        var docHiddenKey = void 0;
        var visibilityChangeEventName = void 0;
    
        if ('hidden' in document) {
            docHiddenKey = 'hidden';
            visibilityChangeEventName = 'visibilitychange';
        } else if ('webkitHidden' in document) {
            docHiddenKey = 'webkitHidden';
            visibilityChangeEventName = 'webkitvisibilitychange';
        }
    
        if (visibilityChangeEventName) {
            if (!document[docHiddenKey]) startFastCheckTimer();
    
            document.addEventListener(visibilityChangeEventName, function () {
                if (document[docHiddenKey]) {
                    stopFastCheckTimer();
                } else {
                    startFastCheckTimer();
                }
            });
        } else startFastCheckTimer();
    }
    
    if (!seppuku) init();
    
    /*
     * 7. Expose Stickyfill
     */
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Stickyfill;
    } else if (isWindowDefined) {
        window.Stickyfill = Stickyfill;
    }
    
})(window, document);
},{}],"src/utils/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateHash = exports.shrug = exports.debounce = exports.$$ = exports.$ = exports.throwError = exports.wait = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * Returned eine Promise, die sich nach gegebener Zeit selbst erfüllt
 * @param {number} time Zeit, bis Promise resolved
 */
var wait = function wait(time) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
};
/**
 * Nimmt Error Message und wirft einen Fehler
 * @param {string} err Fehlermeldung
 */


exports.wait = wait;

var throwError = function throwError(err) {
  throw Error(err);
};
/**
 * Alias zu querySelector(), nimmt CSS Selektor, liefert HTML Element oder null
 * @type {Function}
 * @param {string} selector CSS3 Selektor
 * @returns {HTMLElement|null} Element oder Array aus Elementen
 */


exports.throwError = throwError;
var $ = document.querySelector.bind(document);
/**
 * Wrapper um querySelectorAll(), liefert Array statt NodeList
 * @param {string} selector CSS3 Selektor
 * @returns {Array<HTMLElement>} Array aus gefundenen Elementen
 */

exports.$ = $;

var $$ = function $$(selector) {
  return _toConsumableArray(document.querySelectorAll(selector));
};
/**
 * Führt eine Funktion erst aus, wenn sie eine Zeit lang nicht ausgeführt wurde
 * @param {Function} fn Funktion, die debounced werden soll
 * @param {number} wait Zeit, die vergangen sein muss bevor fn ausgeführt wird
 */


exports.$$ = $$;

var debounce = function debounce(fn) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var timeout;
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var later = function later() {
      timeout = null;
      fn.apply(_this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

exports.debounce = debounce;
var shrugMappings = new Map([// Artikel:
['zwischen-seemannsgarn-und-strandgut', "\uD83C\uDF7A Kneipentour, for science."], ['bringt-farbe-in-die-stadt', "\u26BD Abenteuer in den Graffitiburgen."], ['film-ab-bheaven', "\uD83D\uDEF0 Doch gab es die Mondlandung wirklich?"], ['back-to-print', "\uD83C\uDF6A Aber Print hat keine Cookies."], ['projekt-antarktis', "\uD83D\uDC27 Pengwings."], ['wie-ki-die-designwelt-aendert', "\uD83D\uDD34 I'm afraid I can't let you do that, Dave."], // Team
['jonas', '✔ Perfekt, trotz Serifen.'], ['max', '✔ Ist Photoshop, nicht Paint.']]);

var shrug = function shrug(name) {
  if (!shrugMappings.has(name)) return;
  console.log("\n".concat(shrugMappings.get(name)));
  shrugMappings.delete(name);
};

exports.shrug = shrug;
var updateHash = debounce(function (hash) {
  if (history.replaceState) {
    shrug(hash);
    history.replaceState(null, document.title, "#".concat(hash));
  }
}, 500);
exports.updateHash = updateHash;
},{}],"src/utils/load-article.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startScrollObserver = startScrollObserver;
exports.loadArticle = loadArticle;
exports.default = void 0;

var _2 = require("./");

var _stickyfilljs = _interopRequireDefault(require("stickyfilljs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var queue = Promise.resolve(); // Array, mit einem Objekt für jeden Artikel

var articles = (0, _2.$$)('.article').map(function (element, index) {
  return {
    element: element,
    index: index,
    name: element.id,
    path: "./articles/".concat(element.id, ".html"),
    inViewport: false
  };
}); // Liefert Artikel-Objekt anhand von Index oder Artikelname

var findArticle = function findArticle(target) {
  return typeof target === 'number' ? articles[target] : articles.find(function (_ref) {
    var name = _ref.name;
    return name === target;
  });
};

var insertToDom =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(article) {
    var _ref3,
        fromObserver,
        path,
        element,
        _ref4,
        _ref5,
        html,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref3 = _args.length > 1 && _args[1] !== undefined ? _args[1] : {}, fromObserver = _ref3.fromObserver;
            path = article.path, element = article.element; // Warten bis HTML des Artikels abgerufen und ggf. Wartezeit vorbei ist

            _context.next = 4;
            return Promise.all([fetch(path).then(function (response) {
              return response.text();
            }), fromObserver && (0, _2.wait)(1200)]);

          case 4:
            _ref4 = _context.sent;
            _ref5 = _slicedToArray(_ref4, 1);
            html = _ref5[0];

            if (!(element.getAttribute('data-loaded') === 'true')) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return");

          case 9:
            // Artikel in DOM einfügen
            element.innerHTML = html; // Neu hinzugefügte Artikel-Nummer polyfillen

            _stickyfilljs.default.addOne(element.querySelectorAll('.stickyfill')); // Als geladen markieren


            element.setAttribute('data-loaded', true);
            return _context.abrupt("return");

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function insertToDom(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var loadArticleIfNeeded = function loadArticleIfNeeded(article) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // Schon geladen: Sofort returnen, nothing to do here...
  var isLoaded = article.element.getAttribute('data-loaded') === 'true';
  if (isLoaded) return; // Laden durch Observer: Warten bis Laden früherer Artikel (queue) fertig,
  // dann laden, falls Artikel immer noch im Viewport ist
  // -> stoppt gleichzeitiges Laden mehrerer Artikel bei zu schnellem Scrollen

  if (options.fromObserver) {
    return queue = queue.then(function () {
      // wird erst ausgeführt, nachdem alle anderen Funktionen,
      // die per queue = queue.then() angehängt wurden, beendet sind
      article.inViewport && insertToDom(article, options);
    });
  } // Laden nicht von Observer angefordert: Sofort starten


  return insertToDom(article);
};

function startScrollObserver() {
  // Artikel laden, falls Observer eine Veränderung meldet & Artikel sichtbar
  var handleIntersection = function handleIntersection(entries) {
    entries.forEach(function (entry) {
      var article = findArticle(entry.target.id);
      article.inViewport = entry.isIntersecting;

      if (article.inViewport) {
        // Hash updaten, damit URL direkt auf Artikel verweist
        (0, _2.updateHash)(article.name);
        loadArticleIfNeeded(article, {
          fromObserver: true
        });
      } else {
        var visibleArticle = articles.find(function (_ref6) {
          var inViewport = _ref6.inViewport;
          return inViewport;
        }); // Kein einziger Artikel sichtbar, aber aktuell ein Hash gesetzt? Reset
        // Ansonsten: Hash auf (noch) sichtbaren Artikel aktualisieren

        if (!visibleArticle) location.hash && (0, _2.updateHash)('');else (0, _2.updateHash)(visibleArticle.name);
      }
    });
  }; // Beobachtet jeden Artikel im articles array auf Sichtbarkeitsänderungen


  var options = {
    rootMargin: '-1px 0px'
  };
  var articleObserver = new IntersectionObserver(handleIntersection, options);
  articles.forEach(function (_ref7) {
    var element = _ref7.element;
    return articleObserver.observe(element);
  });
}

function loadArticle(_x2) {
  return _loadArticle.apply(this, arguments);
}

function _loadArticle() {
  _loadArticle = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(target) {
    var targetArticle, articlesToLoad;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            targetArticle = findArticle(target);

            if (targetArticle) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return");

          case 3:
            // Artikel + alle Artikel oberhalb (index kleiner/gleich Zielartikel) laden
            articlesToLoad = articles.filter(function (_, index) {
              return index <= targetArticle.index;
            }).map(loadArticleIfNeeded);
            _context2.prev = 4;
            _context2.next = 7;
            return Promise.all(articlesToLoad);

          case 7:
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](4);
            return _context2.abrupt("return", console.error("Fehler beim Laden des Artikels ".concat(targetArticle.name, ": ").concat(_context2.t0)));

          case 12:
            return _context2.abrupt("return", targetArticle);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[4, 9]]);
  }));
  return _loadArticle.apply(this, arguments);
}

var _default = loadArticle;
exports.default = _default;
},{"./":"src/utils/index.js","stickyfilljs":"node_modules/stickyfilljs/dist/stickyfill.js"}],"src/main.js":[function(require,module,exports) {
"use strict";

var _stickyfilljs = _interopRequireDefault(require("stickyfilljs"));

var _utils = require("./utils");

var _loadArticle = require("./utils/load-article");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function init() {
  return _init.apply(this, arguments);
} // Go!


function _init() {
  _init = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var deviceSupportsTouch, updateWindowHeight, splash, main, hash, targetId, targetArticle;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Prüfen, ob Gerät ein Touch-Interface hat
            deviceSupportsTouch = Boolean('ontouchstart' in window || window.navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0 || window.DocumentTouch && document instanceof DocumentTouch);
            if (deviceSupportsTouch) document.body.classList.add('supports-touch'); // Mobile Viewport-Größe manuell berechnen, vgl.:
            // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

            updateWindowHeight = function updateWindowHeight() {
              var vh = window.innerHeight * 0.01;
              document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
            };

            updateWindowHeight();
            window.addEventListener('resize', (0, _utils.debounce)(updateWindowHeight, 500)); // HTML Elemente

            splash = (0, _utils.$)('.js-splash');
            main = (0, _utils.$)('.js-main'); // Bei Klick auf Splashscreen zu Content scrollen

            splash.addEventListener('click', function () {
              main.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            });
            hash = window.location.hash;
            targetId = hash.slice(1);
            _context2.next = 12;
            return (0, _loadArticle.loadArticle)(targetId);

          case 12:
            targetArticle = _context2.sent;

            if (targetArticle) {
              _context2.next = 16;
              break;
            }

            _context2.next = 16;
            return (0, _loadArticle.loadArticle)(0);

          case 16:
            document.body.classList.remove('empty');
            (0, _loadArticle.startScrollObserver)();

            _stickyfilljs.default.refreshAll();

            if (targetArticle) {
              targetArticle.element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }

            window.addEventListener('hashchange',
            /*#__PURE__*/
            _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee() {
              var hash, targetId, target, article;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      hash = window.location.hash;
                      targetId = hash.slice(1);
                      target = document.getElementById(targetId);

                      if (!(target && target.getAttribute('data-loaded') === 'false')) {
                        _context.next = 10;
                        break;
                      }

                      _context.next = 6;
                      return (0, _loadArticle.loadArticle)(window.location.hash.slice(1));

                    case 6:
                      article = _context.sent;

                      if (article) {
                        _context.next = 9;
                        break;
                      }

                      return _context.abrupt("return");

                    case 9:
                      article.element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });

                    case 10:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this);
            })));

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _init.apply(this, arguments);
}

setTimeout(init, 0);
},{"stickyfilljs":"node_modules/stickyfilljs/dist/stickyfill.js","./utils":"src/utils/index.js","./utils/load-article":"src/utils/load-article.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "8081" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/main.js"], null)
//# sourceMappingURL=/main.1e43358e.map