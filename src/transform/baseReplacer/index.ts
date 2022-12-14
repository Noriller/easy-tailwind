import { e } from '../..';

/**
 * This matches the &&, ||, ?? operators that are used for conditional classes.
 * The first group is the whole match.
 */
const replaceAndOr = /((!*?\w+) (&&|\|\||\?\?) )/gis;

/**
 * This matches the ternary style operator and returns as the 2 groups the true and false matches.
 */
const replaceTernary =
  /(?:!*?\w+)\s*\?\s*(?<q1>['"])(?<m1>.*?)\k<q1>\s*:\s*(?<q2>['"])(?<m2>.*?)\k<q2>/gis;

/**
 * If any of the available transforms arent suited for your needs,
 * then you can use this baseReplacer function to create a replacer
 * that will work for you.
 *
 * This accepts a RegExp where the first group is the args to be passed to `e`/`etw` function (`EasyTailwind` main function).
 *
 * Then in `tailwind.config.cjs`
 *
 *```js
  module.exports = {
    content: {
      // ...
      transform: {
        // ...,
        'my-file-type': baseReplacer(/my regex/)
      }
    },
    // ...
  }
 * ```
 */
export const baseReplacer = (easyTailwindRegex: RegExp) => {
  return (content: string) => {
    try {
      return content.replace(easyTailwindRegex, (match, $1) => {
        const currentTransform = $1
          .replace(replaceAndOr, '')
          .replace(replaceTernary, '"$<m1> $<m2>"')
          .trim();

        try {
          const parsedArgs = new Function(`return [${currentTransform}]`)();
          const parsedClasses = e(...parsedArgs);
          return match.replace($1, `"${parsedClasses}"`);
        } catch (errorParsing) {
          console.error(
            `\nAre you following EasyTailwind rules?\n\n${errorParsing.message} in\n${match}\n\nTrying to be transformed into:\n${currentTransform}\n`,
          );
          return match;
        }
      });
    } catch (errorOnFile) {
      console.error(
        `\nAre you following EasyTailwind rules?\n\n${errorOnFile.message} in file\n${content}\n`,
      );
      return content;
    }
  };
};
