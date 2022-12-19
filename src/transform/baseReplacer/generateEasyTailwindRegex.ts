/**
 * This generates a RegExp based on a custom name of the export you use.
 */
export const generateEasyTailwindRegex = (...functionName: string[]) =>
  new RegExp(
    `\\W(?:${functionName
      .map((s) => s.trim())
      .filter(Boolean)
      .join('|')})\\(.`,
    'gis',
  );
