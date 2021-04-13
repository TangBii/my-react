/* eslint-disable react/prop-types */
import React from 'react';
import { Consumer } from './context.js';
import { pathToRegexp } from 'path-to-regexp';

export default class Route extends React.Component {
  render() {
    return (
      <Consumer>
        {
          (context) => {
            const { location } = context;
            const { pathname } = location;
            const { path = '', component: Component, exact = false } = this.props;
            const params = [];
            const pathName = typeof path === 'object' ? path.pathname : path;
            const regexp = pathToRegexp(pathName, params, { end: exact });
            const result = pathname.match(regexp);
            if (result) {
              const [url, ...values] = result;
              const paramsName = params.map(param => param.name);
              const match = {
                url,
                params: paramsName.reduce((obj, name, index) => {
                  obj[name] = values[index];
                  return obj;
                }, {}),
                isExact: url === pathname,
              };
              if (this.props.component) {
                return <Component {...context} match={match} />;
              } else if (this.props.render) {
                return this.props.render({ ...context, match });
              } else if (this.props.children) {
                return this.props.children({ ...context, match, ...this.props });
              }
            }
            if (this.props.children) {
              return this.props.children({ ...context, ...this.props });
            } else {
              return null;
            }
          }
        }
      </Consumer>
    );
  }
}
