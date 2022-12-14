import { EasyType } from './EasyType';

function easyTW(...args: EasyType[]) {
  return twReducer(args).join(' ');
}

/**
 * EasyTailwind main function. (to be imported as `e` or `etw`)
 *
 * Check the docs for the full version.
 *
 * It accepts any number of args:
 * - strings
 * - The following also accept nesting:
 *   - arrays
 *   - objects
 *     - The keys used will be applied as a modifier to all nested values
 * - All of them also accepts conditionals
 *
 * You can use it as a way to have more readable TW classes, spliting them into lines:
 * ```js
 * e(
 *  "my tw classes line 1",
 *  "my tw classes line 2",
 *  "my tw classes line 3",
 * )
 * ```
 *
 * You can also use to have conditional classes:
 * ```js
 * e(
 *  true && "my tw classes line 1",
 *  false && "my tw classes line 2",
 *  "my tw classes line 3",
 * )
 * ```
 *
 * Finally, you can use to better organize and reduce repetition:
 * ```js
 * e(
 *  "my tw classes line 1",
 *  {
 *    mod1: "classes with the mod1",
 *    mod2: [
 *      "classes with the mod2",
 *      {
 *        subMod: "clases with both mod2 and subMod"
 *      }
 *    ]
 *  }
 * )
 *
 * // this will return:
 * "my tw classes line 1 mod1:classes mod1:with mod1:the mod1:mod1 mod2:classes mod2:with mod2:the mod2:mod2 mod2:subMod:clases mod2:subMod:with mod2:subMod:both mod2:subMod:mod2 mod2:subMod:and mod2:subMod:subMod"
 * ```
 */
export const e: (...args: EasyType[]) => string = new Proxy(easyTW, {
  get: function (obj, prop: string) {
    return prop
      ? (...args: EasyType[]) => twReducer(args).map((c) => `${prop}:${c}`)
      : obj;
  },
});

function twReducer(args: EasyType[]) {
  return (
    args.reduce((acc: string[], cur) => {
      if (cur === undefined || cur === null || cur === false) return acc;

      if (Array.isArray(cur)) {
        acc.push(...cur.filter(Boolean));
      } else if (typeof cur === 'object') {
        Object.entries(cur).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.flat(Infinity).forEach((v) => {
              acc.push(e[key](v));
            });
          } else {
            acc.push(e[key](value));
          }
        });
      } else {
        acc.push(...String(cur).split(' '));
      }

      return acc;
    }, []) as string[]
  ).flat(Infinity);
}

/**
 * @namespace
 * @borrows e as etw
 */
export { e as etw };
