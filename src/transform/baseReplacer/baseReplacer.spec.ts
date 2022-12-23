import { expect, jest, it, describe } from '@jest/globals';
import { baseReplacer } from '.';

describe('.baseReplacer()', () => {
  const replacer = baseReplacer(/e\(./gis);

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

  it('return the just the content when no matches are found', () => {
    expect(replacer(`"content"`)).toEqual('"content"');
  });

  it.each([
    `boolean ? "my" : "classes"`,
    `!boolean ? "my" : "classes"`,
    `!!boolean ? "my" : "classes"`,
  ])('replaces a ternary: %s', (content) => {
    expect(replacer(`e(${content})`)).toEqual(`e('my classes')`);
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
    expect(replacer(`e(${content})`)).toEqual(`e('my classes')`);
  });

  it.each([
    { content: `boolean && ["my", "classes"]`, result: 'my classes' },
    {
      content: `boolean && {
        mod:"my classes"
      }`,
      result: 'mod:my mod:classes',
    },
    {
      content: `{ my: boolean && [ { mod:"classes" } ] }`,
      result: 'my:mod:classes',
    },
  ])(
    'replaces conditionals with objects: $content | return $result',
    ({ content, result }) => {
      expect(replacer(`e(${content})`)).toEqual(`e('${result}')`);
    },
  );

  it.each([
    `(my > boolean) ? "something" : "else"`,
    `(my > boolean) && "something else"`,
    `(my > boolean) || "something else"`,
    `(my > boolean) ?? "something else"`,
  ])('throws when content dont follow etw rules: %s', (content) => {
    expect(replacer(`e(${content})`)).toEqual(`e(${content})`);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `\nAre you following EasyTailwind rules?\n\nmy is not defined in\n${content}\n\nTrying to be transformed into:\n${content}\n`,
    );
  });

  it('returns the content without throwing when no matchs are found', () => {
    const content = 'content';
    expect(baseReplacer(/no match/g)(content)).toEqual(content);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
  });

  it('throws when using regex without global flag', () => {
    const content = 'content';
    expect(baseReplacer(/no match/)(content)).toEqual(content);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `\nAre you following EasyTailwind rules?\n\nString.prototype.matchAll called with a non-global RegExp argument in file\ncontent\n`,
    );
  });
});
