import { baseReplacer } from './baseReplacer';

/**
 * This regex matches anything that resembles EasyTW and returns the $1 group as the args of the EasyTailwind function.
 */
const findClasses = /[\W|\(|\[|\{\S]*?(?:e|etw)\((.*?)\)[\W|)|\]|}\S]*?/gis;

export const replacer = baseReplacer(findClasses);

const content = {
  files: ['!node_modules', './**/*.{js,ts,jsx,tsx,html,vue,svelte,astro}'],
  transform: {
    DEFAULT: replacer,
  },
};

export { baseReplacer, content };
