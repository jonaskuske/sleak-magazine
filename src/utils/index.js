/**
 * Returns a Promise which resolves after a given time
 * @param {number} time Time until Promise resolves
 */
export const wait = time => new Promise(resolve => setTimeout(resolve, time));

/**
 * Throws an error with a given error message
 * @param {string} err Fehlermeldung
 */
export const throwError = err => {
  throw Error(err);
};

/**
 * Alias for querySelector(), takes CSS selctor and returns HTML element or null
 * @type {Function}
 * @param {string} selector CSS3 Selektor
 * @returns {HTMLElement|null} Element oder Array aus Elementen
 */
export const $ = document.querySelector.bind(document);
/**
 * Wrapper for querySelectorAll(), returns Array instead of NodeList
 * @param {string} selector CSS3 Selektor
 * @returns {Array<HTMLElement>} Array aus gefundenen Elementen
 */
export const $$ = selector => [...document.querySelectorAll(selector)];

/**
 * Executes a given function only after it wasn't called again for some time
 * @param {Function} fn Funktion, die debounced werden soll
 * @param {number} wait Zeit, die vergangen sein muss bevor fn ausgeführt wird
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

/* --- Easteregg-ish stuff --- */
const specialMessages = new Map([
  // Artikel:
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

// Updates URL hash without triggering hashchange by using history.replaceState
// Debounced, so updates can only happen every 500ms
export const updateHash = debounce(hash => {
  if (history.replaceState) {
    logSpecialMessage(hash);
    history.replaceState(null, document.title, `#${hash}`);
  }
}, 500);
