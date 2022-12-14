import { baseReplacer } from '../baseReplacer';

/**
 * This regex matches the syntax of class names and returns the $1 group as the args of the EasyTailwind function.
 */
const findClasses = /class(?:name)?={\W*?(?:e|etw)\((.*?)\)\W*?}/gis;

/**
 * If you need to change something in the `content`, add more file extensios or
 * want to support the React extension somewhere else, you can use this.
 *
 * This is a replacer that will work with
 * React syntax of `className={e(* anything goes here *)}` or `className={etw(* anything goes here *)}`
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
 * `content` key for use in React apps with Tailwind.
 *
 * Import in `tailwind.config.cjs`:
 *
 * `const { content } = require('easy-tailwind/transform/react');`
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
    files: ['!node_modules', '.\/**\/*.{js,ts,jsx,tsx,html}'],
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
  files: ['!node_modules', './**/*.{js,ts,jsx,tsx,html}'],
  transform: {
    DEFAULT: replacer,
  },
};
