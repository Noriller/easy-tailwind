# Easy Tailwind

An easier way of writing Tailwind classes.

[Example to play around](https://stackblitz.com/edit/easy-tailwind?file=src/App.jsx)

Still in beta, wait for actual release.

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

The configuration file is something like `tailwind.config.cjs`, and the basic configuration you need is:

```js
// tailwind.config.cjs
const { content } = require('easy-tailwind/transform');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content,
  // ...
  theme: {
    extend: {},
  },
  plugins: [],
};
```

If you need to override something in the config:

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
    extend: {},
  },
  plugins: [],
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
    extend: {},
  },
  plugins: [],
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
    extend: {},
  },
  plugins: [],
};
```

## How to use

### Break lines

### Use Objects

### Conditional classes

### Known limitations

## Rules for it to work

- Use boolean values for conditional expressions (ternary, &&, ||, ??, etc...)
- Don't add variables other than the boolean for the conditional expressions

### Why is this necessary?

Tailwind works with the JIT compiler that can create new classes on the class and inject them.

For it to work, they need to scan all the files looking for the classes, but when you use `EasyTailwind`,
you're basically compressing many of the classes you're trying to use. So we need to add an extra step to Tailwind.

In the Tailwind config (`tailwind.config.cjs`) you add the files it will scan for tailwind classes and a transform that uses a function that will resolve ahead of time what EasyTailwind can produce, so Tailwind can inject ahead of time all possible classes.

However, the more complicated and inclusive you want it to scan for, the more you loose performance (for running in dev mode and for build).

The best balance to be able to accept having conditional classes while minimizing impact on performance is to simplify this, looking for only a boolean variable and not something that can be as simple as a variable or as complex as complex can be.

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
