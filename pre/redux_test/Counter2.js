import React from 'react';

import store from './store';
import bindedActions from './store/actions/counter2';

export default class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: store.getState().counter2 };
  }

  componentDidMount() {
    store.subscribe(() => {
      this.setState({ number: store.getState().counter2 });
    });
  }

  render() {
    return (
      <>
        <h1>{this.state.number}</h1>
        <button onClick={bindedActions.add}>add</button>
        <button onClick={bindedActions.minus}>minus</button>
      </>
    );
  }
}
