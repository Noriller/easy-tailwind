import { baseReplacer } from '../baseReplacer';

/**
 * This regex matches anything that resembles EasyTW and returns the $1 group as the args of the EasyTailwind function.
 */
const findClasses = /[\W|\(|\[|\{\S]*?(?:e|etw)\((.*?)\)[\W|)|\]|}\S]*?/gis;

/**
 * Something hehe
 */
export const replacer = baseReplacer(findClasses);

/**
 * Catch all content with the most common file extensions.
 *
 * Because this is aimed to be as generic as possible,
 * it might might be slower and show more false positives than a dedicated method
 * use it to play around with and test
 *
 * Import in `tailwind.config.cjs`:
 *
 * `const { content } = require('easy-tailwind/transform');`
 *
 * And then:
 * ```js
  module.exports = {
    content,
    // ...
  }
 * ```
 *
 * It simply returns:
 * ```js
  {
    files: ['!node_modules', '.\/**\/*.{js,ts,jsx,tsx,html,vue,svelte,astro}'],
    transform: {
      DEFAULT: replacer,
    }
  }
 * ```
 */
export const content = {
  files: ['!node_modules', './**/*.{js,ts,jsx,tsx,html,vue,svelte,astro}'],
  transform: {
    DEFAULT: replacer,
  },
};
