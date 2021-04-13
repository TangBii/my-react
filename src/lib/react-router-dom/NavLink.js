/* eslint-disable react/no-children-prop */
import React from 'react';
import Link from './Link';
import Route from './Route';

export default class NavLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { to, exact = false } = this.props;
    return (
      <>
        <Route
          path={to}
          exact={exact}
          children={
            (props) => (
              <Link
                to={props.path}
                exact={props.exact}
                className={props.match ? 'active' : ''}
              >
                {this.props.children}
              </Link>
            )
          }
        />
      </>
    );
  }
}
