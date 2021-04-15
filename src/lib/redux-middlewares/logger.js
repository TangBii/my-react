/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const logger = ({ getState, dispatch }) => (next) => (action) => {
  console.log('prev', getState());
  next(action);
  console.log('after', getState());
};

export default logger;
