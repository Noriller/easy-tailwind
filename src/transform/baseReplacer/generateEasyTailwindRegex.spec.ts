import { baseReplacer } from '.';
import { generateEasyTailwindRegex } from './generateEasyTailwindRegex';

describe('.generateEasyTailwindRegex()', () => {
  describe('using a custom name', () => {
    const replacer = baseReplacer(generateEasyTailwindRegex('myFuncName'));
    it('matches "myFuncName"', () => {
      const fixture = `
        export function MyComponent() {
          return <div className={myFuncName({ mod:"my classes"})}>anything</div>;
        }
      `;

      expect(replacer(fixture)).toMatchInlineSnapshot(`
        "
                export function MyComponent() {
                  return <div className={myFuncName('mod:my mod:classes')}>anything</div>;
                }
              "
      `);
    });

    it("doesn't match 'e'", async () => {
      const fixture = `
        export function MyComponent() {
          return <div className={e({ mod:"my classes"})}>anything</div>;
        }
      `;

      expect(replacer(fixture)).toMatchInlineSnapshot(`
        "
                export function MyComponent() {
                  return <div className={e({ mod:\\"my classes\\"})}>anything</div>;
                }
              "
      `);
    });
  });

  describe('when not passing a function name', () => {
    it('throws', () => {
      expect(() => generateEasyTailwindRegex()).toThrowError(
        'Please provide at least one function name when using this.',
      );
    });
  });
});
