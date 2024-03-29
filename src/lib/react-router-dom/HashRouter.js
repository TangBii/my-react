/* eslint-disable no-alert */
/* eslint-disable no-debugger */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
import React from 'react';
import { Provider } from './context';


export default class HashRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        pathname: location.hash.slice(1) || '/',
        query: '',
        state: null,
      },
    };
  }
  componentDidMount() {
    // 默认跳转到 '/'
    location.hash = location.hash.slice(1) ? location.hash.slice(1) : '/';

    // 监听 hashchange 事件
    window.addEventListener('hashchange', () => {
      const hash = location.hash.slice(1) ? location.hash.slice(1) : '/';

      let index = hash.indexOf('?');
      index = index === -1 ? hash.length : index;
      const pathname = hash.slice(0, index);
      const query = hash.slice(index);

      this.setState((state) => ({
        location: {
          ...state.location,
          pathname,
          query,
          state: this.locationState || state.location.state,
        },
      }));
    });
  }
  render() {
    const value = {
      location: this.state.location,
      history: {
        location: this.state.location,
        push: (to) => {
          if (this.message) {
            const result = window.confirm(this.message(typeof to === 'object' ? to : { pathname: to }));
            if (!result) return;
          }
          if (typeof to === 'object') {
            const { pathname, state } = to;
            location.hash = pathname;
            this.locationState = state;
          } else if (typeof to === 'string') {
            location.hash = to;
            this.locationState = {};
          }
        },
        block: (message) => {
          this.message = message;
        },
      },
    };
    return (
      <Provider value={value}>
        {this.props.children}
      </Provider>
    );
  }
}
