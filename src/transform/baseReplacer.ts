import { e } from '..';

/**
 * This matches the &&, ||, ?? operators that are used for conditional classes.
 * The first group is the whole match.
 */
const replaceAndOr = /((!*?\w+) (&&|\|\||\?\?) )/gis;

/**
 * This matches the ternary style operator and returns as the 2 groups the true and false matches.
 */
const replaceTernary = /(?:!*?\w+)\s*\?\s*(.+?)\s*:\s*((?<q>['"]).*?\k<q>)/gis;

export const baseReplacer = (easyTailwindRegex: RegExp) => {
  return (content: string) => {
    try {
      return content.replace(easyTailwindRegex, (match, $1) => {
        const currentTransform = $1
          .replace(replaceAndOr, '')
          .replace(replaceTernary, '$1, $2')
          .trim();

        try {
          const parsedArgs = new Function(`return [${currentTransform}]`)();
          const parsedClasses = e(...parsedArgs);
          return parsedClasses;
        } catch (errorParsing) {
          console.error(
            `\nAre you following EasyTailwind rules?\n\n${errorParsing.message} in\n${match}\n\nTrying to be transformed into:\n${currentTransform}\n`,
          );
          return content;
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
