/* eslint-disable react/prop-types */
import React from 'react';
import Users from '../utils/User';

export default class UserDetail extends React.Component {
  constructor(props) {
    super(props);

    let { state: user } = this.props.location;
    if (!user) {
      const { id } = this.props.match.params;
      user = Users.find(id) || { id: '', name: '' };
    }

    this.state = { user };
  }

  render() {
    return (
      <>
        <h2>id: {this.state.user.id}</h2>
        <h2>name: {this.state.user.name}</h2>
      </>
    );
  }
}
