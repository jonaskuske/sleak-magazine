/**
 * Returned eine Promise, die sich nach gegebener Zeit selbst erfüllt
 * @param {number} time Zeit, bis Promise resolved
 */
export const wait = time => new Promise(resolve => setTimeout(resolve, time));

/**
 * Nimmt Error Message und wirft einen Fehler
 * @param {string} err Fehlermeldung
 */
export const throwError = err => {
  throw Error(err);
};

/**
 * Alias zu querySelector(), nimmt CSS Selektor, liefert HTML Element oder null
 * @type {Function}
 * @param {string} selector CSS3 Selektor
 * @returns {HTMLElement|null} Element oder Array aus Elementen
 */
export const $ = document.querySelector.bind(document);
/**
 * Wrapper um querySelectorAll(), liefert Array statt NodeList
 * @param {string} selector CSS3 Selektor
 * @returns {Array<HTMLElement>} Array aus gefundenen Elementen
 */
export const $$ = selector => [...document.querySelectorAll(selector)];

/**
 * Führt eine Funktion erst aus, wenn sie eine Zeit lang nicht ausgeführt wurde
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

const shrugMappings = new Map([
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

export const shrug = name => {
  if (!shrugMappings.has(name)) return;

  console.log(`\n${shrugMappings.get(name)}`);
  shrugMappings.delete(name);
};

export const updateHash = debounce(hash => {
  if (history.replaceState) {
    shrug(hash);
    history.replaceState(null, document.title, `#${hash}`);
  }
}, 500);
