/* eslint-disable no-unused-expressions */
/* eslint-disable no-alert */
/* eslint-disable no-debugger */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
import React from 'react';
import { Provider } from './context';


export default class BrowserRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        pathname: '/',
        state: null,
      },
    };
  }
  componentDidMount() {
    // 劫持 history.pushState, 当添加时触发 window.onpushstate 事件
    !(function (history) {
      const { pushState } = history;
      history.pushState = (state, title, pathname) => {
        if (typeof window.onpushstate === 'function') {
          window.onpushstate(state, pathname);
        }
        return pushState.call(history, state, title, pathname);
      };
    })(window.history);

    window.onpushstate = (state, pathname) => {
      this.setState({
        location: {
          ...this.state.location,
          pathname,
          state,
        },
      });
    };

    window.onpopstate = (event) => {
      this.setState({
        location: {
          ...this.state.location,
          pathname: document.location.pathname,
          state: event.state,
        },
      });
    };
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
            window.history.pushState(state, '', pathname);
          } else if (typeof to === 'string') {
            window.history.pushState(null, '', to);
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
