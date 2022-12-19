import { replacer } from '..';

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
 * Where the `replacer` is exported from the index of the `/transform` folder.
 *
 * "DEFAULT" is used in all file types, but you can override each file type by extension name
 */
export const content = {
  files: ['!node_modules', './**/*.{js,ts,jsx,tsx,html}'],
  transform: {
    DEFAULT: replacer,
  },
};
