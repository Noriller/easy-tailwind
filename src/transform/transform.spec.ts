import { customNameReplacer } from '.';

describe('.customNameReplacer()', () => {
  describe('using a custom name', () => {
    const replacer = customNameReplacer('myFuncName');

    it('it generates a replacer with the myFuncName', () => {
      const fixture = `
        export function MyComponent() {
          return (
            <div>
              <div className={myFuncName({ mod1:"my classes"})}>anything</div>
              <div className={e({ mod2:"my classes"})}>anything</div>
              <div className={etw({ mod3:"my classes"})}>anything</div>
            </div>
          );
        }
      `;

      expect(replacer(fixture)).toMatchInlineSnapshot(`
        "
                export function MyComponent() {
                  return (
                    <div>
                      <div className={myFuncName('mod1:my mod1:classes')}>anything</div>
                      <div className={e({ mod2:\\"my classes\\"})}>anything</div>
                      <div className={etw({ mod3:\\"my classes\\"})}>anything</div>
                    </div>
                  );
                }
              "
      `);
    });

    it("doesn't match 'e' or 'etw'", async () => {
      const fixture = `
        export function MyComponent() {
          return (
            <div>
              <div className={myFuncName({ mod1:"my classes"})}>anything</div>
              <div className={e({ mod2:"my classes"})}>anything</div>
              <div className={etw({ mod3:"my classes"})}>anything</div>
            </div>
          );
        }
      `;

      expect(replacer(fixture)).toMatchInlineSnapshot(`
        "
                export function MyComponent() {
                  return (
                    <div>
                      <div className={myFuncName('mod1:my mod1:classes')}>anything</div>
                      <div className={e({ mod2:\\"my classes\\"})}>anything</div>
                      <div className={etw({ mod3:\\"my classes\\"})}>anything</div>
                    </div>
                  );
                }
              "
      `);
    });
  });

  describe('without passing a custom name', () => {
    const replacer = customNameReplacer();

    it('it generates a replacer for the default names', () => {
      const fixture = `
        export function MyComponent() {
          return (
            <div>
              <div className={myFuncName({ mod1:"my classes"})}>anything</div>
              <div className={e({ mod2:"my classes"})}>anything</div>
              <div className={etw({ mod3:"my classes"})}>anything</div>
            </div>
          );
        }
      `;

      expect(replacer(fixture)).toMatchInlineSnapshot(`
        "
                export function MyComponent() {
                  return (
                    <div>
                      <div className={myFuncName({ mod1:\\"my classes\\"})}>anything</div>
                      <div className={e('mod2:my mod2:classes')}>anything</div>
                      <div className={etw('mod3:my mod3:classes')}>anything</div>
                    </div>
                  );
                }
              "
      `);
    });
  });

  describe('passing an empty custom name', () => {
    const replacer = customNameReplacer('');

    it('it generates a replacer for the default names', () => {
      const fixture = `
        export function MyComponent() {
          return (
            <div>
              <div className={myFuncName({ mod1:"my classes"})}>anything</div>
              <div className={e({ mod2:"my classes"})}>anything</div>
              <div className={etw({ mod3:"my classes"})}>anything</div>
            </div>
          );
        }
      `;

      expect(replacer(fixture)).toMatchInlineSnapshot(`
        "
                export function MyComponent() {
                  return (
                    <div>
                      <div className={myFuncName({ mod1:\\"my classes\\"})}>anything</div>
                      <div className={e('mod2:my mod2:classes')}>anything</div>
                      <div className={etw('mod3:my mod3:classes')}>anything</div>
                    </div>
                  );
                }
              "
      `);
    });
  });
});
