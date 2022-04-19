const compose = (f, g) => (x) => f(g(x));
const identity = (x) => x;

export { compose, identity };
