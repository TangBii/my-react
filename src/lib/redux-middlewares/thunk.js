/* eslint-disable no-unused-vars */
const thunk = ({ getState, dispatch }) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(dispatch);
  } else {
    next(action);
  }
};

export default thunk;
