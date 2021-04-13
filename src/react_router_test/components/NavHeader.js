import React from 'react';
import { withRouter } from '../lib/react-router-dom';

class NavLink extends React.Component {
  handleClick = () => {
    this.props.history.push('/');
  }
  render() {
    return (
      <>
        <button onClick={this.handleClick}>去首页</button>
      </>
    );
  }
}

export default withRouter(NavLink);
