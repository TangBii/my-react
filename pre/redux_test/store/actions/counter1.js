/* eslint-disable prefer-promise-reject-errors */
import { ADD1, MINUS1 } from './action-types';

const add = (value) => {
  return { type: ADD1, payload: { value } };
};

const minus = () => {
  return { type: MINUS1 };
};

const addThunk = (value) => (dispatch) => {
  setTimeout(() => dispatch(add(value)), 1000);
};

const addPromise = () => ({
  type: ADD1,
  payload: new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve('成功');
      } else {
        reject('失败');
      }
    }, 1000);
  }),
});

export {
  add,
  minus,
  addThunk,
  addPromise,
};
