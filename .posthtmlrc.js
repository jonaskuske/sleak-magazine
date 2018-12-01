module.exports = {
  lowerCaseAttributeNames: false,
  plugins: {
    'posthtml-expressions': {
      locals: {
        teamInlineStyle:
          '<style>.team__image>img{opacity:0;}.team__text{opacity:0;}</style>',
      },
    },
  },
};
