module.exports = {
  plugins: {
    autoprefixer: { grid: true },
    'postcss-focus-visible': { preserve: false },
    'postcss-custom-media': {
      preserve: false,
      importFrom: {
        customMedia: {
          '--viewport-tablet': 'screen and (min-width: 400px)',
          '--viewport-tablet-xl': 'screen and (min-width: 700px)',
          '--viewport-desktop': 'screen and (min-width: 1000px)',
        },
      },
    },
  },
};
