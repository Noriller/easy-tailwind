// type EasyTypes = string | string[] | EasyTypeObj;

// type EasyTypeObj = {
//   [key: string]: EasyTypes | EasyType;
// };
// export type EasyType = EasyTypes;

export type EasyType = unknown;

function easyTW(...args: EasyType[]) {
  return twReducer(args).join(' ');
}

export const e: (...args: EasyType[]) => string = new Proxy(easyTW, {
  get: function (obj, prop: string) {
    return prop
      ? (...args: EasyType[]) => twReducer(args).map((c) => `${prop}:${c}`)
      : obj;
  },
});

function twReducer(args: EasyType[]) {
  return (
    args.reduce((acc: string[], cur) => {
      if (cur === undefined || cur === null || cur === false) return acc;

      if (Array.isArray(cur)) {
        acc.push(...cur.filter(Boolean));
      } else if (typeof cur === 'object') {
        Object.entries(cur).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.flat(Infinity).forEach((v) => {
              acc.push(e[key](v));
            });
          } else {
            acc.push(e[key](value));
          }
        });
      } else {
        acc.push(...String(cur).split(' '));
      }

      return acc;
    }, []) as string[]
  ).flat(Infinity);
}

export const etw = e;
