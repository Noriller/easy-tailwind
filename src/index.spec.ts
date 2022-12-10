import { e } from './';

describe('EasyTW', () => {
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
});
