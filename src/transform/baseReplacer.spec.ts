import { expect, jest, it, describe } from '@jest/globals';
import { baseReplacer } from '.';

describe('.baseReplacer()', () => {
  const catchAllRegex = /(.*)/gis;
  const replacer = baseReplacer(catchAllRegex);

  const consoleErrorSpy = jest.spyOn(
    globalThis.console,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.console.error.name,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns nothing when nothing is passed', () => {
    expect(replacer('')).toBe('');
  });

  it('return the just the content when ', () => {
    expect(replacer('content')).toEqual('content');
  });

  it.each([
    `boolean ? "my" : "classes"`,
    `!boolean ? "my" : "classes"`,
    `!!boolean ? "my" : "classes"`,
  ])('replaces a ternary: %s', (content) => {
    expect(replacer(content)).toEqual('my classes');
  });

  it.each([
    `boolean && "my classes"`,
    `boolean || "my classes"`,
    `boolean ?? "my classes"`,
    `!boolean && "my classes"`,
    `!boolean || "my classes"`,
    `!boolean ?? "my classes"`,
    `!!boolean && "my classes"`,
    `!!boolean || "my classes"`,
    `!!boolean ?? "my classes"`,
  ])('replaces conditionals: %s', (content) => {
    expect(replacer(content)).toEqual('my classes');
  });

  it.each([
    `(my > boolean) ? "something" : "else"`,
    `(my > boolean) && "something else"`,
    `(my > boolean) || "something else"`,
    `(my > boolean) ?? "something else"`,
  ])('throws when content dont follow etw rules: %s', (content) => {
    expect(replacer(content)).toEqual(content);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `\nAre you following EasyTailwind rules?\n\nmy is not defined in\n${content}\n\nTrying to be transformed into:\n${content}\n`,
    );
  });

  it('returns the content without throwing when no matchs are found', () => {
    const content = 'content';
    expect(baseReplacer(/no match/)(content)).toEqual(content);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
  });

  it('throws when no group is found in the match', () => {
    const content = 'content';
    expect(baseReplacer(/.*/)(content)).toEqual(content);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `\nAre you following EasyTailwind rules?\n\n$1.replace is not a function in file\ncontent\n`,
    );
  });
});
