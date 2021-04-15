const createStore = (reducer, preloadedState) => {
  let state = preloadedState;
  const listeners = [];

  const getState = () => {
    return state;
  };

  const subscribe = (listener) => {
    listeners.push(listener);

    // 返回取消订阅的函数
    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());

    // 返回 action
    return action;
  };

  // 初始化 state
  dispatch({ type: '@@redux/INIT' });

  return {
    getState,
    subscribe,
    dispatch,
  };
};

export default createStore;
