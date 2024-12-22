/**
 * @typedef {Object} CSSNanoOptions
 * @property {boolean} discardComments.removeAll - Remove all comments
 * @property {boolean} colormin - Minify colors
 * @property {boolean} reduceIdents - Control class/ID minification
 * @property {boolean} mergeLonghand - Merge longhand properties
 * @property {boolean} cssDeclarationSorter - Sort CSS declarations
 * @property {boolean} minifyFontValues - Minify font declarations
 * @property {boolean} svgo - Control SVG optimization
 */

/**
 * @typedef {Object} PostCSSContext
 * @property {'production' | 'development'} env - The current environment
 */

/**
 * PostCSS configuration with environment-specific optimizations
 * @param {PostCSSContext} ctx - PostCSS context object
 * @returns {import('postcss').ProcessOptions} PostCSS configuration object
 */
export default (ctx) => ({
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(ctx.env === 'production'
      ? {
          cssnano: {
            preset: [
              'advanced',
              {
                discardComments: {
                  removeAll: true,
                },
                colormin: true,
                reduceIdents: false, // Prevents breaking animations
                mergeLonghand: true,
                cssDeclarationSorter: true,
                minifyFontValues: true,
                svgo: false, // Disable SVG optimization as it can cause issues
              },
            ],
          },
        }
      : {}),
  },
});
