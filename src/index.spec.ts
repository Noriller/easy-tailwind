import { e, etw } from './';

describe('EasyTW', () => {
  it('exports both "e" and "etw" as options', () => {
    expect(e).toBe(etw);
  });

  it.each([
    { args: [], expected: '' },
    { args: [null], expected: '' },
    { args: [undefined], expected: '' },
    { args: [null, undefined], expected: '' },
    { args: [''], expected: '' },
    { args: ['class'], expected: 'class' },
    { args: ['multiple classes'], expected: 'multiple classes' },
    {
      args: [['multiple classes', 'in', 'one array']],
      expected: 'multiple classes in one array',
    },
    {
      args: [['multiple classes'], ['in'], ['multiples array']],
      expected: 'multiple classes in multiples array',
    },
    {
      args: [
        'multiple classes',
        [true && 'in', true && 'array', false && 'never'],
      ],
      expected: 'multiple classes in array',
    },
    {
      args: ['multiple classes', { mod: 'class' }],
      expected: 'multiple classes mod:class',
    },
    {
      args: ['multiple classes', { mod: 'class with mods' }],
      expected: 'multiple classes mod:class mod:with mod:mods',
    },
    {
      args: ['multiple classes', { mod: ['base', 'other classes'] }],
      expected: 'multiple classes mod:base mod:other mod:classes',
    },
    {
      args: [
        'multiple classes',
        {
          mod1: ['base', 'other classes'],
          mod2: ['base', { 'additional-mod': 'other classes' }],
        },
      ],
      expected:
        'multiple classes mod1:base mod1:other mod1:classes mod2:base mod2:additional-mod:other mod2:additional-mod:classes',
    },
    {
      args: [
        'lorem ipsum dolor',
        ['amet', 'consectetur adipiscing elit'],
        ['Sed sit', 'amet ligula', ['ex', 'Ut']],
      ],
      expected:
        'lorem ipsum dolor amet consectetur adipiscing elit Sed sit amet ligula ex Ut',
    },
    {
      args: [
        {
          mod1: [
            'amet',
            'consectetur adipiscing elit',
            ['Sed sit', 'amet ligula', ['ex ut', 'lorem ipsum']],
          ],
        },
      ],
      expected:
        'mod1:amet mod1:consectetur mod1:adipiscing mod1:elit mod1:Sed mod1:sit mod1:amet mod1:ligula mod1:ex mod1:ut mod1:lorem mod1:ipsum',
    },
  ])('return $expected when $args', ({ args, expected }) => {
    expect(e(...args)).toBe(expected);
  });

  it('handles a really complex object', () => {
    expect(
      e(
        'Lorem ipsum',
        'dolor sit',
        ['amet', 'consectetur adipiscing elit'],
        ['Sed sit', 'amet ligula', ['ex', 'Ut']],
        {
          mod1: 'in suscipit metus',
          mod2: [
            'vel accumsan',
            'orci',
            ['Vivamus sapien', 'neque', ['dictum vel', 'felis maximus']],
          ],
          mod3: ['luctus', { mod4: 'lorem' }],
          mod5: [
            'Fusce malesuada massa',
            ['eu turpis finibus'],
            {
              mod6: [
                'mollis',
                {
                  mod7: [
                    'In augue tortor',
                    {
                      mod8: [
                        'porta eu erat sit amet',
                        ['tristique', 'ullamcorper', 'arcu'],
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ),
    ).toBe(
      'Lorem ipsum dolor sit amet consectetur adipiscing elit Sed sit amet ligula ex Ut mod1:in mod1:suscipit mod1:metus mod2:vel mod2:accumsan mod2:orci mod2:Vivamus mod2:sapien mod2:neque mod2:dictum mod2:vel mod2:felis mod2:maximus mod3:luctus mod3:mod4:lorem mod5:Fusce mod5:malesuada mod5:massa mod5:eu mod5:turpis mod5:finibus mod5:mod6:mollis mod5:mod6:mod7:In mod5:mod6:mod7:augue mod5:mod6:mod7:tortor mod5:mod6:mod7:mod8:porta mod5:mod6:mod7:mod8:eu mod5:mod6:mod7:mod8:erat mod5:mod6:mod7:mod8:sit mod5:mod6:mod7:mod8:amet mod5:mod6:mod7:mod8:tristique mod5:mod6:mod7:mod8:ullamcorper mod5:mod6:mod7:mod8:arcu',
    );
  });

  it.each([false && 'anything', undefined && 'anything', null && 'anything'])(
    'handles falsy values',
    (falsy) => {
      expect(e(falsy)).toBe('');
    },
  );

  it('accepts alternatives syntax', () => {
    // this syntax don't work with the replacers, so it shouldn't be used directly
    // (I've learned about having to transform the files afterwards and had a different idea on how it could be used)
    // it's possible I'll refactor it since there's no gain to having it

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(e.mod('classes', 'and more classes')).toEqual([
      'mod:classes',
      'mod:and',
      'mod:more',
      'mod:classes',
    ]);
    expect(e['special-mod']('classes', 'and more classes')).toEqual([
      'special-mod:classes',
      'special-mod:and',
      'special-mod:more',
      'special-mod:classes',
    ]);
  });

  it('handles an edge case of empty string', () => {
    // this should not happen, but when a "prop" of the
    // proxy handle is falsy, it defaults to the unproxied object
    expect(e['']('anything')).toEqual('anything');
  });

  describe('examples from TW docs', () => {
    it.each([
      {
        args: [
          'bg-slate-100 rounded-xl p-8',
          {
            md: 'flex p-0',
            dark: 'bg-slate-800',
          },
        ],
        expected:
          'bg-slate-100 rounded-xl p-8 md:flex md:p-0 dark:bg-slate-800',
      },
      {
        args: [
          'w-24 h-24 rounded-full mx-auto',
          {
            md: 'w-48 h-auto rounded-none',
          },
        ],
        expected:
          'w-24 h-24 rounded-full mx-auto md:w-48 md:h-auto md:rounded-none',
      },
      {
        args: [
          'pt-6 text-center space-y-4',
          {
            md: 'p-8 text-left',
          },
        ],
        expected: 'pt-6 text-center space-y-4 md:p-8 md:text-left',
      },
      {
        args: ['text-sky-500', { dark: 'text-sky-400' }],
        expected: 'text-sky-500 dark:text-sky-400',
      },
      {
        args: ['text-slate-700', { dark: 'text-slate-500' }],
        expected: 'text-slate-700 dark:text-slate-500',
      },
      {
        args: [
          'flex-none w-48 mb-10 relative z-10',
          {
            before: 'absolute top-1 left-1 w-full h-full bg-teal-400',
          },
        ],
        expected:
          'flex-none w-48 mb-10 relative z-10 before:absolute before:top-1 before:left-1 before:w-full before:h-full before:bg-teal-400',
      },
      {
        args: [
          'relative flex flex-wrap items-baseline pb-6',
          {
            before: 'bg-black absolute -top-6 bottom-0 -left-60 -right-6',
          },
        ],
        expected:
          'relative flex flex-wrap items-baseline pb-6 before:bg-black before:absolute before:-top-6 before:bottom-0 before:-left-60 before:-right-6',
      },
      {
        args: [
          'relative w-10 h-10 flex items-center justify-center text-black',
          {
            before: 'absolute z-[-1] top-0.5 left-0.5 w-full h-full',
            'peer-checked': ['bg-black text-white', { before: 'bg-teal-400' }],
          },
        ],
        expected:
          'relative w-10 h-10 flex items-center justify-center text-black before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:bg-black peer-checked:text-white peer-checked:before:bg-teal-400',
      },
      {
        args: [
          'py-6 px-4',
          {
            sm: 'p-6',
            md: 'py-10 px-8',
          },
        ],
        expected: 'py-6 px-4 sm:p-6 md:py-10 md:px-8',
      },
      {
        args: [
          'max-w-4xl mx-auto grid grid-cols-1',
          {
            lg: 'max-w-5xl gap-x-20 grid-cols-2',
          },
        ],
        expected:
          'max-w-4xl mx-auto grid grid-cols-1 lg:max-w-5xl lg:gap-x-20 lg:grid-cols-2',
      },
      {
        args: [
          'relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0',
          {
            sm: 'bg-none row-start-2 p-0',
            lg: 'row-start-1',
          },
        ],
        expected:
          'relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 sm:bg-none sm:row-start-2 sm:p-0 lg:row-start-1',
      },
      {
        args: [
          'mt-1 text-lg font-semibold text-white',
          {
            sm: ['text-slate-900', { dark: 'text-white' }],
            md: 'text-2xl',
          },
        ],
        expected:
          'mt-1 text-lg font-semibold text-white sm:text-slate-900 sm:dark:text-white md:text-2xl',
      },
      {
        args: [
          'text-sm leading-4 font-medium text-white',
          {
            sm: ['text-slate-500', { dark: 'text-slate-400' }],
          },
        ],
        expected:
          'text-sm leading-4 font-medium text-white sm:text-slate-500 sm:dark:text-slate-400',
      },
      {
        args: [
          'grid gap-4 col-start-1 col-end-3 row-start-1',
          {
            sm: 'mb-6 grid-cols-4',
            lg: 'gap-6 col-start-2 row-end-6 row-span-6 mb-0',
          },
        ],
        expected:
          'grid gap-4 col-start-1 col-end-3 row-start-1 sm:mb-6 sm:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0',
      },
      {
        args: [
          'w-full h-60 object-cover rounded-lg',
          {
            sm: 'h-52 col-span-2',
            lg: 'col-span-full',
          },
        ],
        expected:
          'w-full h-60 object-cover rounded-lg sm:h-52 sm:col-span-2 lg:col-span-full',
      },
      {
        args: [
          'hidden w-full h-52 object-cover rounded-lg',
          {
            sm: 'block col-span-2',
            md: 'col-span-1',
            lg: 'row-start-2 col-span-2 h-32',
          },
        ],
        expected:
          'hidden w-full h-52 object-cover rounded-lg sm:block sm:col-span-2 md:col-span-1 lg:row-start-2 lg:col-span-2 lg:h-32',
      },
      {
        args: [
          'hidden w-full h-52 object-cover rounded-lg',
          {
            md: 'block',
            lg: 'row-start-2 col-span-2 h-32',
          },
        ],
        expected:
          'hidden w-full h-52 object-cover rounded-lg md:block lg:row-start-2 lg:col-span-2 lg:h-32',
      },
      {
        args: [
          'mt-4 text-xs font-medium flex items-center row-start-2',
          {
            sm: 'mt-1 row-start-3',
            md: 'mt-2.5',
            lg: 'row-start-2',
          },
        ],
        expected:
          'mt-4 text-xs font-medium flex items-center row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2',
      },
      {
        args: [
          'text-indigo-600 flex items-center',
          { dark: 'text-indigo-400' },
        ],
        expected: 'text-indigo-600 flex items-center dark:text-indigo-400',
      },
      {
        args: ['mr-1 stroke-current', { dark: 'stroke-indigo-500' }],
        expected: 'mr-1 stroke-current dark:stroke-indigo-500',
      },
      {
        args: ['mr-1 text-slate-400', { dark: 'text-slate-500' }],
        expected: 'mr-1 text-slate-400 dark:text-slate-500',
      },
      {
        args: [
          'mt-4 col-start-1 row-start-3 self-center',
          {
            sm: 'mt-0 col-start-2 row-start-2 row-span-2',
            lg: 'mt-6 col-start-1 row-start-3 row-end-4',
          },
        ],
        expected:
          'mt-4 col-start-1 row-start-3 self-center sm:mt-0 sm:col-start-2 sm:row-start-2 sm:row-span-2 lg:mt-6 lg:col-start-1 lg:row-start-3 lg:row-end-4',
      },
      {
        args: [
          'mt-4 text-sm leading-6 col-start-1',
          {
            sm: 'col-span-2',
            lg: 'mt-6 row-start-4 col-span-1',
            dark: 'text-slate-400',
          },
        ],
        expected:
          'mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:mt-6 lg:row-start-4 lg:col-span-1 dark:text-slate-400',
      },
      {
        args: [
          'bg-white space-y-4 p-4',
          {
            sm: 'px-8 py-6',
            lg: 'p-4',
            xl: 'px-8 py-6',
          },
        ],
        expected:
          'bg-white space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6',
      },
      {
        args: [
          {
            hover: 'bg-blue-400',
          },
          'group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm',
        ],
        expected:
          'hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm',
      },
      {
        args: [
          'absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none',
          {
            'group-focus-within': 'text-blue-500',
          },
        ],
        expected:
          'absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500',
      },
      {
        args: [
          { focus: 'ring-2 ring-blue-500 outline-none' },
          'appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm',
        ],
        expected:
          'focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm',
      },
      {
        args: [
          'bg-slate-50 p-4 grid grid-cols-1 gap-4 text-sm leading-6',
          {
            sm: 'px-8 pt-6 pb-8 grid-cols-2',
            lg: 'p-4 grid-cols-1',
            xl: 'px-8 pt-6 pb-8 grid-cols-2',
          },
        ],
        expected:
          'bg-slate-50 p-4 grid grid-cols-1 gap-4 text-sm leading-6 sm:px-8 sm:pt-6 sm:pb-8 sm:grid-cols-2 lg:p-4 lg:grid-cols-1 xl:px-8 xl:pt-6 xl:pb-8 xl:grid-cols-2',
      },
      {
        args: [
          { hover: 'bg-blue-500 ring-blue-500 shadow-md' },
          'group rounded-md p-3 bg-white ring-1 ring-slate-200 shadow-sm',
        ],
        expected:
          'hover:bg-blue-500 hover:ring-blue-500 hover:shadow-md group rounded-md p-3 bg-white ring-1 ring-slate-200 shadow-sm',
      },
      {
        args: [
          'grid grid-cols-2 grid-rows-2 items-center',
          {
            sm: 'block',
            lg: 'grid',
            xl: 'block',
          },
        ],
        expected:
          'grid grid-cols-2 grid-rows-2 items-center sm:block lg:grid xl:block',
      },
      {
        args: [{ 'group-hover': 'text-white' }, 'font-semibold text-slate-900'],
        expected: 'group-hover:text-white font-semibold text-slate-900',
      },
      {
        args: [
          'col-start-2 row-start-1 row-end-3',
          {
            sm: 'mt-4',
            lg: 'mt-0',
            xl: 'mt-4',
          },
        ],
        expected: 'col-start-2 row-start-1 row-end-3 sm:mt-4 lg:mt-0 xl:mt-4',
      },
      {
        args: [
          'flex justify-end -space-x-1.5',
          {
            sm: 'justify-start',
            lg: 'justify-end',
            xl: 'justify-start',
          },
        ],
        expected:
          'flex justify-end -space-x-1.5 sm:justify-start lg:justify-end xl:justify-start',
      },
      {
        args: [
          { hover: 'border-blue-500 border-solid bg-white text-blue-500' },
          'group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3',
        ],
        expected:
          'hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3',
      },
      {
        args: [
          'bg-white border-slate-100 border-b rounded-t-xl p-4 pb-6 space-y-6',
          {
            dark: 'bg-slate-800 border-slate-500',
            sm: 'p-10 pb-8 space-y-8',
            lg: 'p-6 space-y-6',
            xl: 'p-10 pb-8 space-y-8',
          },
        ],
        expected:
          'bg-white border-slate-100 border-b rounded-t-xl p-4 pb-6 space-y-6 dark:bg-slate-800 dark:border-slate-500 sm:p-10 sm:pb-8 sm:space-y-8 lg:p-6 lg:space-y-6 xl:p-10 xl:pb-8 xl:space-y-8',
      },
      {
        args: [
          'hidden',
          {
            sm: 'block',
            lg: 'hidden',
            xl: 'block',
          },
        ],
        expected: 'hidden sm:block lg:hidden xl:block',
      },
      {
        args: [
          'rounded-lg text-xs leading-6 font-semibold px-2 ring-2 ring-inset ring-slate-500 text-slate-500',
          {
            dark: 'text-slate-100 ring-0 bg-slate-500',
          },
        ],
        expected:
          'rounded-lg text-xs leading-6 font-semibold px-2 ring-2 ring-inset ring-slate-500 text-slate-500 dark:text-slate-100 dark:ring-0 dark:bg-slate-500',
      },
      {
        args: [
          'relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4',
          'text-sm text-slate-700 font-medium border border-transparent rounded-bl-lg',
          {
            hover: 'text-slate-500',
            focus: 'outline-none shadow-outline-blue border-blue-300 z-10',
          },
          'transition ease-in-out duration-150',
        ],
        expected:
          'relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-slate-700 font-medium border border-transparent rounded-bl-lg hover:text-slate-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 transition ease-in-out duration-150',
      },
    ])('return $expected when $args', ({ args, expected }) => {
      expect(e(...args)).toBe(expected);
    });
  });
});
