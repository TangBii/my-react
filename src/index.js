import React from './lib/react';
import ReactDOM from './lib/react-dom';

// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';

let element;


// jsx
// element = 
//   <h1 className="highlight" style={{color: 'pink'}}>
//     hello<span>_word</span>
//   </h1>

// createElement
// element =  React.createElement('h1', {
//   className: 'highlight',
//   style: {
//     color: 'pink'
//   }
// }, 'hello', React.createElement('span', {}, '_world'));


// 函数组件
const FnComponent = (props) => {
  return React.createElement('h1', {
    className: 'highlight',
    style: {
      color: 'pink'
    }
  }, 'hello', React.createElement('span', {}, '_world'));;
}

// 类组件
class ClassComponent extends React.Component {

  render() {
    const { name } = this.props;
    return React.createElement('h1', {
        className: 'highlight',
        style: {
          color: 'pink'
        }
      }, name , React.createElement('span', {}, '_world'));
  }
}


// ReactDOM.render(element, document.getElementById('root'));
// ReactDOM.render(FnComponent(), document.getElementById('root'));
ReactDOM.render(
  React.createElement(ClassComponent, { name: 'hello11' }),
  document.getElementById('root')
);

