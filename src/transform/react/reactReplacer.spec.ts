import { replacer } from '.';

describe('react| .replacer()', () => {
  const consoleErrorSpy = jest.spyOn(
    globalThis.console,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.console.error.name,
  );

  it('handles a file without matches', () => {
    const fixtureWithoutMatch = `
      export function MyComponent() {
        return <div className="not using it">anything</div>;
      }
    `;

    expect(replacer(fixtureWithoutMatch)).toBe(fixtureWithoutMatch);
  });

  it('handles a file with simple matches', async () => {
    const fixtureWithSimpleMatches = `
      export function MyComponentWithMatches() {
        return (
          <div className="not using here">
            <div className={e('using with e')}>anything1</div>
            <div className={etw('using with etw')}>anything2</div>
          </div>
        );
      }
    `;

    expect(replacer(fixtureWithSimpleMatches)).toMatchInlineSnapshot(`
      "
            export function MyComponentWithMatches() {
              return (
                <div className=\\"not using here\\">
                  <div className={e(\\"using with e\\")}>anything1</div>
                  <div className={etw(\\"using with etw\\")}>anything2</div>
                </div>
              );
            }
          "
    `);
  });

  it('handles a file with a complex usage', () => {
    const fixtureWithComplexUsage = `
      export function MyComponentWithMatches() {
        const random = Math.random() > 0.5;
        return (
          <div className="not using here">
            <div className={
              e(
                'using with e',
                "in a complex manner",
                {
                  mod1: ["value", "other"],
                  mod2: {
                    sub1: random && "random",
                  },
                },
                {
                  another: random ? "true" : "false",
                  another2: !!random || "something"
                }
              )
            }>anything1</div>
          </div>
        )
      }
    `;
    expect(replacer(fixtureWithComplexUsage)).toMatchInlineSnapshot(`
      "
            export function MyComponentWithMatches() {
              const random = Math.random() > 0.5;
              return (
                <div className=\\"not using here\\">
                  <div className={
                    e(\\"using with e in a complex manner mod1:value mod1:other mod2:sub1:random another:true another:false another2:something\\")
                  }>anything1</div>
                </div>
              )
            }
          "
    `);
  });

  it('handles a file that dont follow etw rules', () => {
    const fixtureWithError = `
      export function MyComponentWithError() {
        return (
          <div className="not using here">
            <div className={
              e(
                Math.random() > 0.5 ? 'using with e' : 'but with error'
              )
            }>anything1</div>
          </div>
        )
      }
    `;
    expect(replacer(fixtureWithError)).toEqual(fixtureWithError);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `
Are you following EasyTailwind rules?

Unexpected string in
className={
              e(
                Math.random() > 0.5 ? 'using with e' : 'but with error'
              )
            }

Trying to be transformed into:
Math.random() > 0.\"using with e but with error\"
`,
    );
  });
});
