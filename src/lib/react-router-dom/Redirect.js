/* eslint-disable react/prop-types */
import React from 'react';
import RouteContext from './context';

export default class Redirect extends React.Component {
  static contextType = RouteContext;

  render() {
    const { from, to } = this.props;
    const { pathname } = this.context.location;
    if (from === undefined || from === pathname) {
      this.context.history.push(to);
    }
    return null;
  }
}
