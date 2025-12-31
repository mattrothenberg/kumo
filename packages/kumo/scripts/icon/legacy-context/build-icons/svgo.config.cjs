module.exports = {
  multipass: true,
  js2svg: {
    indent: 2,
    pretty: true,
  },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // viewBox is required to resize SVGs with CSS.
          // @see https://github.com/svg/svgo/issues/1128
          removeViewBox: false,
          removeUnknownsAndDefaults: true,
          removeComments: true,
          removeMetadata: true,
          removeTitle: true,
          removeDesc: true,
          cleanupIds: true,
          inlineStyles: {
            onlyMatchedOnce: false,
            removeMatchedSelectors: true,
          },
        },
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: '(fill|stroke)',
      },
    },
    'removeStyleElement',
    'removeDimensions',
  ],
};
