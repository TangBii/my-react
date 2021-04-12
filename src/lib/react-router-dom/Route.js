/* eslint-disable react/prop-types */
import React from 'react';
import { Consumer } from './context.js';
import { pathToRegexp } from 'path-to-regexp';

export default class Route extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Consumer>
        {
          (context) => {
            const { location } = context;
            const { pathname } = location;
            const { path, component: Component, exact = false } = this.props;
            const regexp = pathToRegexp(path, [], { end: exact });
            if (regexp.test(pathname)) {
              return <Component location={location} />;
            }
            return null;
          }
        }
      </Consumer>
    );
  }
}
