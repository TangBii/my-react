import React from 'react';
import RouteContext from './context';

export default class Prompt extends React.Component {
  static contextType = RouteContext;

  componentWillUnmount() {
    this.context.history.block(null);
  }

  render() {
    const { when, message } = this.props;
    if (when) {
      this.context.history.block(message);
    } else {
      this.context.history.block(null);
    }
    return null;
  }
}
