import * as Option from "./Option.js";

const shuffle = (arr) => {
  let xs = [...arr];
  for (var i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = xs[i];
    xs[i] = xs[j];
    xs[j] = temp;
  }
  return xs;
};

const head = (xs) => (xs.length > 0 ? Option.some(xs[0]) : Option.none);
const map = (fn) => (arr) => arr.map(fn);
const filter = (fn) => (arr) => arr.filter(fn);

export { head, map, filter, shuffle };
