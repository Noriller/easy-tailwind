import { baseReplacer } from '../baseReplacer';

/**
 * This regex matches anything that resembles EasyTW and returns the $1 group as the args of the EasyTailwind function.
 */
const findClasses = /[\W|\(|\[|\{\S]*?(?:e|etw)\((.*?)\)[\W|)|\]|}\S]*?/gis;

/**
 * If you need to change something in the `content`, add more file extensios or
 * want to support a generic file type, you can use this.
 * Please note that this is less performant than a dedicated solution.
 *
 * This is a replacer that has a catch all approach
 * looking for the syntax of `e(* anything goes here *)` or `etw(* anything goes here *)`
 *
 * Then in `tailwind.config.cjs`
 *
 *```js
  module.exports = {
    content: {
      // ...
      transform: {
        // ...,
        'my-file-type': replacer,
        DEFAULT: replacer, // default is a catch all
      }
    },
    // ...
  }
 * ```
 */
export const replacer = baseReplacer(findClasses);

/**
 * Catch all `content` key with the most common file extensions and the most generic `replacer` possible.
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
 *
 * Where the `replacer` is also exported from this folder and returns whats needed
 * for it to be able to work properly
 *
 * "DEFAULT" is used in all file types, but you can override each file type by extension name
 */
export const content = {
  files: ['!node_modules', './**/*.{js,ts,jsx,tsx,html,vue,svelte,astro}'],
  transform: {
    DEFAULT: replacer,
  },
};
