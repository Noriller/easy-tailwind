import { e } from '../..';
import { extractArgumentsIndex } from './extractor';

/**
 * This matches the start of any use of EasyTailwind
 */
const genericRegex = /\W(?:e|etw)\(./gis;

/**
 * This matches the &&, ||, ?? operators that are used for conditional classes.
 * The first group is the whole match.
 */
const replaceAndOr = /((!*?\w+)\s*?(&&|\|\||\?\?))/gis;

/**
 * This matches the ternary style operator and returns as the 2 groups the true and false matches.
 */
const replaceTernary =
  /(?:!*?\w+)\s*\?\s*(?<q1>['"`])(?<m1>.*?)\k<q1>\s*:\s*(?<q2>['"`])(?<m2>.*?)\k<q2>/gis;

/**
 * If any of the available transforms aren't suited for your needs,
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
        'my-file-type': baseReplacer(/my regex/),
        DEFAULT: baseReplacer(/my regex/), // default is a catch all
      }
    },
    // ...
  }
 * ```
 */
export const baseReplacer = (easyTailwindRegex: RegExp = genericRegex) => {
  return (content: string) => {
    try {
      const parsedSlices = [...content.matchAll(easyTailwindRegex)]
        .map((matchArr) => {
          const extractedArgs = extractArgumentsIndex(
            matchArr.index,
            matchArr[0].length,
            content,
          );

          const currentTransform = extractedArgs
            .replace(replaceAndOr, '')
            .replace(replaceTernary, '"$<m1> $<m2>"')
            .trim();

          try {
            const parsedArgs = new Function(`return [${currentTransform}]`)();
            return e(...parsedArgs);
          } catch (errorParsing) {
            console.error(
              `\nAre you following EasyTailwind rules?\n\n${errorParsing.message} in\n${extractedArgs}\n\nTrying to be transformed into:\n${currentTransform}\n`,
            );
            return '';
          }
        })
        .filter(Boolean);

      if (parsedSlices.length === 0) {
        return content;
      }

      return content.concat('\n').concat(parsedSlices.join('\n'));
    } catch (errorOnFile) {
      console.error(
        `\nAre you following EasyTailwind rules?\n\n${errorOnFile.message} in file\n${content}\n`,
      );
      return content;
    }
  };
};
