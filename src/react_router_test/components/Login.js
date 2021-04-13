import React from 'react';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = () => {
    sessionStorage.setItem('login', true);
    const { from } = this.props.location.state || {};
    if (from) {
      this.props.history.push(from);
    } else {
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <>
        <button onClick={this.handleClick}>Login</button>
      </>
    );
  }
}
