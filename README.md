# Easy Tailwind

An easier way of writing Tailwind classes.

[Example to play around](https://stackblitz.com/edit/easy-tailwind?file=src/App.jsx)

## Installation

Install with your preferred manager:

```bash
npm i easy-tailwind
```

```bash
yarn add easy-tailwind
```

```bash
pnpm add easy-tailwind
```

## Setup

The configuration file is usually located in the `root` of the application and looks something like `tailwind.config.cjs`. The basic configuration you need is:

```js
// tailwind.config.cjs
const { content } = require('easy-tailwind/transform');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content,
  // ...
  theme: {
    // ...
  },
  plugins: [
    // ...
  ],
};
```

If you need to override something in the `content` config:

```js
// tailwind.config.cjs
const { replacer, baseReplacer } = require('easy-tailwind/transform');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
      '!node_modules',
      './**/*.{js,ts,jsx,tsx,html,vue,svelte,astro}' // here you can specify your own files and directories
    ],
    transform: {
      DEFAULT: replacer, // default is applied to all files types

            // baseReplacer accepts a RegExp can work for your needs
      html: baseReplacer(/my regex for html/) // you can override for one file type
    },
  }
  // ...
  theme: {
    // ...
  },
  plugins: [
    // ...
  ],
};
```

### Especific configuration for frameworks

Right now, the only especific one is `React`, instead of importing from `easy-tailwind/transform`, import from `easy-tailwind/transform/react`

While `baseReplacer` is exported only from the root of `easy-tailwind/transform`, for each framework supported `content` and `replacer` will be exported.

In the example for `React`:

```js
// tailwind.config.cjs
const { content } = require('easy-tailwind/transform/react');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content,
  // ...
  theme: {
    // ...
  },
  plugins: [
    // ...
  ],
};
```

Where `content` is equivalent to:

```js
// tailwind.config.cjs
const { replacer } = require('easy-tailwind/transform/react');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: ['!node_modules', './**/*.{js,ts,jsx,tsx,html}'],
    transform: {
      DEFAULT: replacer,
    },
  }
  // ...
  theme: {
    // ...
  },
  plugins: [
    // ...
  ],
};
```

## How to use

First, import `e` or `etw`:

```js
import { e } from 'easy-tailwind';
// e and etw resolve to the same function
```

This is a pure function, so you can be sure that it will always return the same values as you pass the same values:

```js
e(
  'some base classes here',
  'breaking the line because',
  'it was getting too long',
  {
    mod1: 'classes with mod1',
    mod2: [
      'classes with only mod2',
      {
        subMod1: 'nested classes with both',
      },
    ],
  },
);
// this will return:
'some base classes here breaking the line because it was getting too long mod1:classes mod1:with mod1:mod1 mod2:classes mod2:with mod2:only mod2:mod2 mod2:subMod1:nested mod2:subMod1:classes mod2:subMod1:with mod2:subMod1:both';
```

Now use it where you would use the Tailwind classes.

Example below will use the React syntax, but as long as you can call it, it will probably work:

```js
<div
  className={e(
    'text-lg font-medium text-black',
    {
      hover: 'underline decoration-black',
      sm: [
        'text-base text-blue-500',
        {
          hover: 'decoration-cyan-500',
        },
      ],
      lg: [
        'text-2xl text-green-500',
        {
          hover: 'decoration-amber-500',
        },
      ],
    }
  )}
>
  EasyTailwind!!!
</div>
```

Which is way faster and easier to understand, maintain and debug than:

```js
"text-lg font-medium text-black hover:underline hover:decoration-black sm:text-base sm:text-blue-500 sm:hover:decoration-cyan-500 lg:text-2xl lg:text-green-500 lg:hover:decoration-amber-500"
```

> ℹ️ Sense of style not included. 🤣

### Break lines

One of the uses is to "break lines" of the styles.

For this, just split the clases into multiple strings and put each one in a single line.

Example:

```js
<div
  className={e(
    'text-lg',
    'font-medium',
    'text-black',
    'underline',
    'decoration-cyan-500'
  )}
>
  Multiple lines!
</div>
```

### Use Objects

This is what you were waiting for, objects were the the keys are applied to whatever the value is, even nested structures.

Example:

```js
<div
  className={e({
    sm: "text-sm text-blue-500",
    md: "text-base text-green-500",
    lg: ["text-lg text-black", {
      hover: "text-red-500"
    }],
  })}
>
  Objects!
</div>
```

This will create exactly what you would expect:

```js
"sm:text-sm sm:text-blue-500 md:text-base md:text-green-500 lg:text-lg lg:text-black lg:hover:text-red-500"
```

Each key (sm, md, lg, [&_li], group-hover, ...) will apply to everything inside the value.

Each value can be a string, another object, or an array with strings and/or objects.

> ⚠️ The ordering is applied in the order of the object.
>
> Some Tailwind classes don't work properly depending on the order,
>
> so always check if what you will be building is valid.

### Conditional classes

One thing we usually need are conditional classes, we got you covered!

As long as you follow [the rules](#rules-for-it-to-work):

- Use boolean values for conditional expressions (ternary, &&, ||, ??, etc...)
- Don't add variables other than the boolean for the conditional expressions
- Don't use round brackets inside `e`/`etw`

Example:

```js
const boolean = Math.random() > 0.5;
// ...
<div
  className={e(
    boolean ? 'text-lg' : 'text-base',
    boolean && 'font-medium',
    !boolean && 'text-black',
  )}
>
  Conditional classes!
</div>
```

## Rules for it to work

1. Use boolean values for conditional expressions (ternary, &&, ||, ??, etc...)
2. Don't add variables other than the boolean for the conditional expressions
3. Don't use round brackets inside `e`/`etw`

### Known limitations

Those limitations are more about the `replacer` in the transform than in the main function.

Right now, depending on the classes you're trying, especially if they have round brackets, it will not work and you will be given a warning (check the terminal where you're running your `dev` or `build` script).

When you're inspecting it in the browser, it will show the classes as normal, but it won't work (the function works as normal, but the transformer won't be able to parse it and the classes won't be added and sent to the browser).

In those cases, you can append them separately from those you use with `EasyTailwind`.

Examples:

```js
className={`${variable} [&:has(complicated to parse)] ${e("here goes the safe to parse classes")}`}
```

### Why is this necessary?

Tailwind works with the JIT compiler that can create new classes on the fly and inject them.

For it to work, they need to scan all the files looking for the classes, but when you use `EasyTailwind`,
you're basically compressing many of the classes you're trying to use. So we need to add an extra step to Tailwind.

In the Tailwind config (`tailwind.config.cjs`) you add the files it will scan for tailwind classes and a transform that uses a function that will resolve ahead of time what `EasyTailwind` can produce, so Tailwind can inject ahead of time all possible classes.

However, the more complicated and inclusive you want it to scan for, the more you loose performance (for running in dev mode and for build).

The best balance to be able to accept having conditional classes while minimizing impact on performance is to simplify this, looking for only a boolean variable and not something that can be as simple as a variable or as complex as complex can be.

As for the round brackets, it's mostly a RegExp problem/limitation where I couldn't cover all the cases I wanted to cover.

See more at [Tailwind "Tranfsforming source files"](https://tailwindcss.com/docs/content-configuration#transforming-source-files).

## Does it Support XYZ?

If you're asking... I'll say probably, but probably not in the best way right now.

If you can use `e('tw classes')` and it generate the classes (even if they don't actually work), then mostly likely all we need to do is create the `RegExp`.

We export the generic functions you can use, but to have a better performance you probably want to use the `baseReplacer` that is exported from `easy-tailwind/transform` and use a `RegExp` that will fit XYZ.

Feel free to open a PR if you get it working. =D

If you need help with that, send me examples of how you can use EasyTailwind (a sandbox example would be best) in XYZ files and I'm sure we can work it out.

See more at [Tailwind "Tranfsforming source files"](https://tailwindcss.com/docs/content-configuration#transforming-source-files).

## Final Considerations

This is mostly 'pure' functions, so we don't need to worry about getting "stale".

More functionalities are welcome, but ultimately this package can have months between any updates.
This doesn't mean that it's "dead", just that it's doing what it needs.

Today it works with Tailwind v3, I'm not sure if with lower versions or for higher versions.
As long as the `content` part doesn't change, then you can just import and use it.
If it changes, you have the `replacer` for the transformations (as long as it supports it), but expect updates as soon as possible.

### Possible roadmap

It's way easier to get a match that captures too much than an group that matches only what is needed.

I'm thinking on using RegExp to narrow down and a custom, string manipulation, function to get only what's needed.
This would mean being able to use anything inside `EasyTailwind` (Aside from rules 1 and 2).

## Work with me

<https://www.linkedin.com/in/noriller/>

### Hit me up at Discord

<https://discord.gg/XtNPk7HeCa>

### Or Donate

- [$5 Nice job! Keep it up.](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=5)
- [$10 I really liked that, thank you!](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=10)
- [$42 This is exactly what I was looking for.](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=42)
- [$1K WOW. Did not know javascript could do that!](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=1000)
- [$5K I need something done ASAP! Can you do it for yesterday?](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=5000)
- [$10K Please consider this: quit your job and work with me!](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=10000)
- [$??? Shut up and take my money!](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD)

## That’s it! 👏
