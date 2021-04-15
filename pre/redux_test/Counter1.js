import React from 'react';
import { add, minus, addThunk, addPromise } from './store/actions/counter1';
import { connect } from '../lib/react-redux';

class Counter extends React.Component {
  render() {
    return (
      <>
        <h1>{this.props.number}</h1>
        <button onClick={() => this.props.add(1)}>add</button>
        <button onClick={this.props.minus}>minus</button>
        <button onClick={() => this.props.addThunk(1)}>addThunk</button>
        <button onClick={this.props.addPromise}>addPromise</button>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { number: state.counter1 };
};

export default connect(
  mapStateToProps,
  { add, minus, addThunk, addPromise },
)(Counter);
