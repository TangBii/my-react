/* eslint-disable import/no-named-as-default */
import React from 'react';
import RouteContext from './context';

export default class Provider extends React.Component {
  render() {
    return (
      <RouteContext.Provider value={this.props.store}>
        {this.props.children}
      </RouteContext.Provider>
    );
  }
}
