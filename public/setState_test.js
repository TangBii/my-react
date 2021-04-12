import React from '../src/lib/react/react';
import ReactDOM from '../src/lib/react/react-dom';

class StateTest extends React.Component {
  state = { num: 0 };

  handleClick1 = () => {
    // 0 0 显示 1, 状态更新合并, 事件执行结束后在统一更新
    this.setState({ num: this.state.num + 1 });
    console.log(this.state.num);

    this.setState({ num: this.state.num + 1 });
    console.log(this.state.num);
  }

  handleClick2 = () => {
    // 1 1 显示 1, setState 支持 callback
    this.setState({ num: this.state.num + 1 }, () => {
      console.log(this.state.num);
    });

    this.setState({ num: this.state.num + 1 }, () => {
      console.log(this.state.num);
    });

  }

  handleClick3 = () => {
    // 0 0 2 2 显示 2, setState 支持传入一个函数
    this.setState(state => ({num: state.num + 1}), () => {
      console.log(this.state.num);
    });
    console.log(this.state.num);


    this.setState(state => ({num: state.num + 1}), () => {
      console.log(this.state.num);
    });
    console.log(this.state.num);
  }
  
  render() {
    return React.createElement('div', {
      style: {
        paddingLeft: '100px'
      }
    }, 
    React.createElement('div', {}, this.state.num),
    React.createElement('button', {
      onClick: this.handleClick1
    }, '+'),
    )
  }
}

ReactDOM.render(React.createElement(StateTest), document.getElementById('root'));