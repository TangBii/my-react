import { ADD2, MINUS2 } from './action-types';
import store from '../index';

import { bindActionCreators } from '../../../lib/redux';


const add = (value) => {
  return { type: ADD2, preload: { value } };
};

const minus = () => {
  return { type: MINUS2 };
};

const bindActions = bindActionCreators({ add, minus }, store.dispatch);

export default bindActions;
