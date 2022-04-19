const Function = require("./Function");

const noneT = "NONE";
const someT = "SOME";
const none = { t: noneT };
const noneFn = () => ({ t: noneT });
const some = (x) => ({ t: someT, val: x });
const isSome = (x) => x.t === someT;
const isNone = (x) => x.t === noneT;
const eq = (a, b) => a.t === b.t && (isSome(a) ? a.val === b.val : true);
const map = (fn) => (x) => isSome(x) ? some(fn(x.val)) : x;
const flatten = (x) => (isSome(x) ? x.val : x);
const flatmap = (fn) => Function.compose(flatten)(map(fn));
const getOrElse = (or) => (x) => x && x.t === someT ? x.val : or;
const getOrUndefined = getOrElse(undefined);
const getOrNull = getOrElse(null);
const getOrThrow = (x) =>
  isSome(x) ? x.val : new Error("Trying to get a value, but encountered None");
const catSomes = (xs) => xs.filter(isSome);
const catNones = (xs) => xs.filter(isNone);

export {
  noneT,
  someT,
  none,
  noneFn,
  some,
  isSome,
  isNone,
  eq,
  map,
  flatten,
  flatmap,
  getOrElse,
  getOrUndefined,
  getOrNull,
  getOrThrow,
  catSomes,
  catNones,
};
