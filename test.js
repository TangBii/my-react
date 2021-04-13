const { pathToRegexp } = require('path-to-regexp');

const pathname = '/user/1/wukong';

const keys = [];
const regexp = pathToRegexp('/user/:id/:name', keys, { end: false });

const result = pathname.match(/fdaf/);

// const paramsName = keys.map(key => key.name);

// const [url, ...values] = result;


// const obj = paramsName.reduce((obj, name, index) => {
//   obj[name] = values[index];
//   return obj;
// }, {});

console.log(result);
