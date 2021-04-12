import ReactDOM from './react-dom';


const createElement = (type, config = {}, ...children) => {
  return {
    type,
    props: { ...config, children },
  };
};

class Component {
  static isReactComponent = true;

  constructor(props) {
    this.props = props;

    // 临时更新队列
    this.updateQueue = [];
    this.callbacks = [];

    // 是否处于批量更新模式
    this.isBatchingUpdate = false;

    // refs
    this.refs = {};
  }

  setState(partialState, callback) {
    this.updateQueue.push(partialState);
    callback && this.callbacks.push(callback);

    if (!this.isBatchingUpdate) {
      this.forceUpdate();
    }
  }

  forceUpdate() {
    if (this.updateQueue.length === 0) return;
    // 更新 state
    this.state = this.updateQueue.reduce((preState, currUpdate) => {
      const newState = typeof currUpdate === 'function' ? currUpdate(preState) : currUpdate;
      return { ...preState, ...newState };
    }, this.state);

    // 清空队列
    this.updateQueue.length = 0;

    // 重新渲染
    ReactDOM.updateComponent(this);

    // 执行回调
    this.callbacks.forEach((callback) => callback());
    this.callbacks.length = 0;
  }
}

const createRef = () => ({ current: null });

const forwardRef = (FunctionComponent) => {
  return class extends Component {
    render() {
      return FunctionComponent(this.props, this.props.ref);
    }
  };
};

const createContext = () => {
  const Provider = (props) => {
    Provider.value = props.value;
    return props.children;
  };

  const Consumer = (props) => {
    return props.children(Provider.value);
  };

  return { Provider, Consumer };
};

export default {
  createElement,
  Component,
  createRef,
  forwardRef,
  createContext,
};
