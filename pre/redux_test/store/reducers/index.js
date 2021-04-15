import { combineReducers } from '../../../lib/redux';

import counter1 from './conuter1';
import counter2 from './counter2';


const reducers = {
  counter1,
  counter2,
};

export default combineReducers(reducers);
