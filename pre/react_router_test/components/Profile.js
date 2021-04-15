/* eslint-disable react/prop-types */
import React from 'react';
import { Redirect, Route } from '../lib/react-router-dom';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Route
          path="/profile"
          render={
            () => {
              if (sessionStorage.getItem('login')) {
                return <h1>Profile</h1>;
              } else {
                return <Redirect to={{ pathname: '/login', state: { from: this.props.location.pathname } }} />;
              }
            }
          }
        />
      </>
    );
  }
}
