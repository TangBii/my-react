import React from 'react';
import RouteContext from './context';
import { pathToRegexp } from 'path-to-regexp';

export default class Switch extends React.Component {
  static contextType = RouteContext;

  render() {
    const { pathname } = this.context.location;
    const children = [].concat(this.props.children);
    for (const child of children) {
      const { path = '/', exact = false } = child.props;
      const regexp = pathToRegexp(path, [], { end: exact });
      if (regexp.test(pathname)) {
        return child;
      }
    }
    return null;
  }
}
