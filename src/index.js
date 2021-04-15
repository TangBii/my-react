import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from './lib/react-redux';


import store from './components/store';

import Counter1 from './components/Counter1';
import Counter2 from './components/Counter2';

ReactDOM.render(
  <Provider store={store}>
    <Counter1 />
    <Counter2 />
  </Provider>,
  document.getElementById('root'),
);
