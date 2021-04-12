/* eslint-disable react/prop-types */
import React from 'react';
import { Provider } from './context';


export default class HashRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pathname: location.hash.slice(1) || '/',
    };
  }
  componentDidMount() {
    // 默认跳转到 '/'
    location.hash = location.hash.slice(1) ? location.hash.slice(1) : '/';

    // 监听 hashchange 事件
    window.addEventListener('hashchange', () => {
      const pathname = location.hash.slice(1) ? location.hash.slice(1) : '/';
      this.setState({ pathname });
    });
  }
  render() {
    const value = {
      location: {
        pathname: this.state.pathname,
      },
    };
    return (
      <Provider value={value}>
        {this.props.children}
      </Provider>
    );
  }
}
