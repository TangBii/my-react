const add1 = (str) => 1 + str;
const add2 = (str) => 2 + str;
const add3 = (str) => 3 + str;

const compose = (...fns) => fns.reduce((a, b) => (...args) => b(a(...args)));

console.log(compose(add1, add2, add3)('str'));

