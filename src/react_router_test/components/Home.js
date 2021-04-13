import React from 'react';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);
    return (
      <>
        <h1>Home</h1>
      </>
    );
  }
}
