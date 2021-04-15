
const applyMiddleware = (...middlewares) => (createStore) => (combineReducers) => {
  const store = createStore(combineReducers);

  let dispatch = null;
  const middlewareAPI = {
    getState: store.getState,
    dispatch: (...args) => dispatch(...args),
  };
  const chain = middlewares.map(middleware => middleware(middlewareAPI));
  dispatch = compose(...chain)(store.dispatch);
  // const [thunk, promise, logger] = chain;
  // dispatch = thunk(promise(logger(store.dispatch)));
  return {
    ...store,
    dispatch,
  };
};

const compose = (...fns) => fns.reduce((a, b) => (...args) => b(a(...args)));

export default applyMiddleware;
