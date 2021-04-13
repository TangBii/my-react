/* eslint-disable react/prop-types */
import React from 'react';
import RouteContext from './context';

export default class Link extends React.Component {
  static contextType = RouteContext;

  handleClick = () => {
    const { history } = this.context;
    history.push(this.props.to);
  }

  render() {
    return (
      <a className={this.props.className} onClick={this.handleClick}>{this.props.children}</a>
    );
  }
}
