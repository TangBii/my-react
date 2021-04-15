import * as types from '../actions/action-types';

const reducer = (state = 100, action) => {
  console.log(action.payload);
  switch (action.type) {
    case types.ADD1:
      return action.payload ? state + action.payload.value : state + 1;
    case types.MINUS1:
      return state - 1;
    default:
      return state;
  }
};

export default reducer;
