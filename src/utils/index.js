// Promise, die sich nach gegebener Zeit erfüllt
export const wait = time => new Promise(resolve => setTimeout(resolve, time));

// Liefert Array falls Selektor mit "." (Klasse), ansonsten Node
export const $ = selector =>
  selector.startsWith('.')
    ? [...document.querySelectorAll(selector)]
    : document.querySelector(selector);

// Debounce: Tool, um eine Funktion erst auszuführen,
// wenn sie eine Zeit lang nicht ausgeführt wurde
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

const shrugMappings = {
  // Artikel:
  seemann: `🍺 Kneipentour, for science.`,
  graffiti: `⚽ Abenteuer in den Graffitiburgen.`,
  apollo: `🛰 Doch gab es die Mondlandung wirklich?`,
  nachbar: `🍪 Aber Print hat keine Cookies.`,
  antarktis: `🐧 Pengwings.`,
  ki: `🔴 I'm afraid I can't let you do that, Dave.`,
  // Team:
  jonas: '✔ Perfekt, trotz Serifen.',
  max: '✔ Ist Photoshop, nicht Paint.',
};

export const shrug = name => {
  if (!shrugMappings.hasOwnProperty(name)) return;

  console.log(`\n${shrugMappings[name]}`);
};
