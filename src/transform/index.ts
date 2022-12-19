import { baseReplacer } from './baseReplacer';
import { generateEasyTailwindRegex } from './baseReplacer/generateEasyTailwindRegex';

/**
 * If you need to change something in the `content`, add or remove file extensions or
 * use other transformers, then you can use this.
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
const replacer = baseReplacer();

/**
 * If you're renaming or have collisions with other functions named `e` or `etw`
 *
 * You can add here all the names you're using. By default it's `e` and `etw`
 *
 * Example:
 *
 * ```js
 * const replacer = customNameReplacer('e', 'etw');
 * ```
 */
const customNameReplacer = (...modifiedNames: string[]) => {
  baseReplacer(
    generateEasyTailwindRegex(
      ...(modifiedNames.length === 0 ? ['e', 'etw'] : modifiedNames),
    ),
  );
};

/**
 * Catch all `content` key with the most common file extensions.
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
 * for it to be able to work properly.
 *
 * If you're renaming the default names, then use `customNameReplacer`.
 *
 * "DEFAULT" is used in all file types, but you can override each file type by extension name
 */
const content = {
  files: ['!node_modules', './**/*.{js,ts,jsx,tsx,html,vue,svelte,astro}'],
  transform: {
    DEFAULT: replacer,
  },
};

export { customNameReplacer, replacer, content };
