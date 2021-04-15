/*
  {counter1, counter2}
*/

const combineReducers = (reducers) => {
  return (state = {}, action) => {
    const nextState = {};

    const keys = Object.keys(reducers);

    for (const key of keys) {
      // 使用对应的 reducer 和 state 更新状态
      const reducer = reducers[key];
      const stateForKey = state[key];
      nextState[key] = reducer(stateForKey, action);
    }

    return nextState;
  };
};

export default combineReducers;
