/* eslint-disable no-unused-vars */
import { createStore, applyMiddleware } from '../../lib/redux';
import { logger, thunk, promise } from '../../lib/redux-middlewares';

import reducers from './reducers';

const store = applyMiddleware(thunk, promise, logger)(createStore)(reducers);

export default store;
