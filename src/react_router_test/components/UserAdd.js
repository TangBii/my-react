/* eslint-disable react/prop-types */
import React from 'react';
import User from '../utils/User';
import { Prompt } from '../lib/react-router-dom';


export default class UserAdd extends React.Component {
  constructor(props) {
    super(props);
    this.usenameRef = React.createRef();
    this.state = { isBlocking: false };
  }

  handleClick = () => {
    this.setState({ isBlocking: false }, () => {
      User.add(this.usenameRef.current.value);
      this.props.history.push('/user/userlist/');
    });
  }

  handleChange = event => {
    this.setState({ isBlocking: event.target.value.length > 0 });
  }

  render() {
    return (
      <>
        <form>
          <Prompt
            when={this.state.isBlocking}
            message={() => '跳转后表单信息丢失, 是否确认?'}
          />
          <input type="text" ref={this.usenameRef} onChange={this.handleChange} />
          <button onClick={this.handleClick}>添加</button>
        </form>
      </>
    );
  }
}
