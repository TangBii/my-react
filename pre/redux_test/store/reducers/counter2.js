import * as types from '../actions/action-types';

const reducer = (state = 200, action) => {
  switch (action.type) {
    case types.ADD2:
      return state + 2;
    case types.MINUS2:
      return state - 2;
    default:
      return state;
  }
};

export default reducer;
