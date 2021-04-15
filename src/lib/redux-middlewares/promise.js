/* eslint-disable no-unused-vars */
const promise = ({ getState, dispatch }) => (next) => (action) => {
  if (action.payload && typeof action.payload.then === 'function') {
    action.payload.then(
      data => dispatch({ ...action, payload: { value: data } }),
      err => dispatch({ ...action, payload: { value: err }, err: true }),
    );
  } else {
    next(action);
  }
};

export default promise;
