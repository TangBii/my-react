/* eslint-disable no-prototype-builtins */
/* eslint-disable no-debugger */

const bindActionCreator = (actionCreator, dispatch) => {
  return (...params) => dispatch(actionCreator.apply(null, params));
};


const bindActionCreators = (actionCreators, dispatch) => {
  if (typeof actionCreators === 'object') {
    const result = {};
    for (const key in actionCreators) {
      if (actionCreators.hasOwnProperty(key)) {
        const actionCreator = actionCreators[key];
        result[key] = bindActionCreator(actionCreator, dispatch);
      }
    }
    return result;
  } else if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }
};

export default bindActionCreators;
