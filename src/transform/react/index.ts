import { baseReplacer } from '../baseReplacer';

/**
 * This regex matches the syntax of class names and returns the $1 group as the args of the EasyTailwind function.
 */
const findClasses = /class(?:name)?={\W*?(?:e|etw)\((.*?)\)\W*?}/gis;

export const replacer = baseReplacer(findClasses);

export const content = {
  files: ['!node_modules', './**/*.{js,ts,jsx,tsx,html}'],
  transform: {
    DEFAULT: replacer,
  },
};
