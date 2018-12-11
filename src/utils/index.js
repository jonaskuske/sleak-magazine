/**
 * Returns a Promise which resolves after a given time
 * @param {number} time Time until Promise resolves
 */
export const wait = time => new Promise(resolve => setTimeout(resolve, time));

/**
 * Throws an error with a given error message
 * @param {string} err The error message
 */
export const throwError = err => {
  throw Error(err);
};

/**
 * Alias for querySelector(), takes CSS selector and returns HTMLElement or null
 * @type {Function}
 * @param {string} selector CSS3 Selektor
 * @returns {HTMLElement|null} The found HTMLElement (null if there's no match)
 */
export const $ = document.querySelector.bind(document);
/**
 * Wrapper for querySelectorAll(), returns Array instead of NodeList
 * @param {string} selector CSS3 Selector
 * @returns {Array<HTMLElement>} Array of found elements
 */
export const $$ = selector => [...document.querySelectorAll(selector)];

/**
 * Executes a given function only after it wasn't called again for some time
 * @param {Function} fn function that should be debounced
 * @param {number} wait time that has to pass until fn is called
 */
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

export const isCrawler = /bot|googlebot|crawler|spider|robot|crawling/i.test(
  navigator.userAgent,
);

/* --- Easteregg-ish stuff --- */
const specialMessages = new Map([
  // Articles
  ['zwischen-seemannsgarn-und-strandgut', `🍺 Kneipentour, for science.`],
  ['bringt-farbe-in-die-stadt', `⚽ Abenteuer in den Graffitiburgen.`],
  ['film-ab-bheaven', `🛰 Doch gab es die Mondlandung wirklich?`],
  ['back-to-print', `🍪 Aber Print hat keine Cookies.`],
  ['projekt-antarktis', `🐧 Pengwings.`],
  [
    'wie-ki-die-designwelt-aendert',
    `🔴 I'm afraid I can't let you do that, Dave.`,
  ],
  // Team
  ['jonas', '✔ Perfekt, trotz Serifen.'],
  ['max', '✔ Ist Photoshop, nicht Paint.'],
]);

const logSpecialMessage = name => {
  if (!specialMessages.has(name)) return;

  console.log(`\n${specialMessages.get(name)}`);
  // Delete, so messages are only logged once
  specialMessages.delete(name);
};
/* --- --- */

/**
 * Updates URL hash without triggering hashchange by using history.replaceState
 * Debounced, so updates can only happen every 500ms
 * @param {string} hash The hash (without the leading #)
 * @param {string?} title (optional) new document.title
 */
export const updateHash = debounce((hash, title) => {
  if (history.replaceState) {
    logSpecialMessage(hash);
    history.replaceState(null, document.title, `#${hash}`);
  }
  if (title) document.title = title;
}, 500);
