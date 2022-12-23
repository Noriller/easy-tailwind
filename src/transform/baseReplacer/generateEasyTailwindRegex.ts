/**
 * This generates a RegExp based on a custom name of the export you use.
 */
export const generateEasyTailwindRegex = (...functionName: string[]) => {
  if (functionName.length === 0) {
    throw new Error(
      'Please provide at least one function name when using this.',
    );
  }

  return new RegExp(
    `\\W(?:${functionName
      .map((s) => s.trim())
      .filter(Boolean)
      .join('|')})\\(.`,
    'gis',
  );
};
