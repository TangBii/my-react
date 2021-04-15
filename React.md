## 简易版 React 全家桶

## 1. 元素的生成和渲染

使用 `React.createElement(type, config, ...children)` 可以生成 React 元素，参数类型如下表

| 名称     | 类型               | 说明                                                         |
| -------- | ------------------ | ------------------------------------------------------------ |
| type     | string \| function | 类型为 string 表示普通 DOM 元素， 类型为function 时表示函数或类组件 |
| config   | object             | 属性对象                                                     |
| children | array              | 子元素数组                                                   |

使用 `ReactDOM.render(element, container, component)` 渲染元素，渲染逻辑如下：

1. 如果待渲染的元素是字符或数字，即 `element === string | number` ，生成文本节点
2. 如果待渲染的元素是函数或类组件，即`element.type === function` ，执行对应方法生成 React 元素
   1. 如果是类组件，即 `type.isReactCoponent === true`，此时 `element = new type(element.props).render()`
   2. 如果是函数组件，即 `type.isReactCoponent === false`，此时`element = type(element.props)`
3. 调用 `createDOM(element, component)`生成真实 DOM 
   1. 使用 `document.createElement(type)` 生成真实 DOM
   2. 从 `props` 中读取属性信息，给真实 DOM 添加属性
   3. 读取`props.children`，递归渲染
4. 将真实 DOM 插入 `container`中

>render() 和 createDOM() 中的 component 都是可选参数，用于在递归渲染时逐级传递实例，绑定合成事件时需要用到该属性

核心代码如下：

1) react.js

```js
// 创建虚拟 DOM
const createElement = (type, config = {}, ...children) => {
  return {
    type,
    props: { ...config, children }
  }
}

// 类组件继承的基类
class Component {
  constructor(props) {
    static isReactComponent = true;
    this.props = props;
  }
}
```

2) react-dom.js

```js
// 注意要把 component 逐层传递下去，绑定合成事件时要用到
const render = (element, container, component) => {

  let dom = null;

  // 1. 文本类型
  if (typeof element === 'string' || typeof element === 'number') {
    dom = document.createTextNode(element);
  }

  // 2. 函数/类组件
  else if (typeof element.type === 'function') {
    const { type, props } = element;

    if (type.isReactComponent) {
      component = new type(props);
      dom = createDOM(component.render(), component);
      // 把真实 dom 挂载到组件实例，便于后续更新
      component.dom = dom;
    } else {
      dom = createDOM(type(props), component);
    }
  }
  
  // react 元素
  else {
    dom = createDOM(element, component);
  }

  container.appendChild(dom);
}

// 生成真实 DOM
const createDOM = (element, component) => {

  const { type, props } = element;
  const { children, ...attrs } = props;

  // 创建真实 DOM
  const dom = document.createElement(type);

  // 添加属性和绑定事件
  for (const key in attrs) {
    const value = attrs[key];

    // 处理特殊属性，className, style 等 
    switch (true) {
      case key === 'className':
        dom.className = value;
        break;
      case key === 'style':
        const styles = value;
        for (const key in styles) {
          dom.style[key] = styles[key];
        }
        break;
      case key.startsWith('on'):
        // 绑定事件
        addEvent(dom, key, value, component);
        break;
      default:
        dom.setAttribute(key, value);
    }
  }

  // 递归渲染
  children.forEach(child => render(child, dom, component));

  return dom;
}
```

## 2. 合成事件

React 的事件机制如下：

1. 使用事件委托，把事件绑定在 document 上
2. 设置 `component.isBatchingUpdate = true`， 启用批量更新
3. 触发事件，并向上冒泡
4. 设置 `component.isBatchingUpdate = false` ，禁用批量更新
5. 调用 `forceUpdate` 强制更新

核心代码如下：

```js
// 合成事件
const addEvent = (dom, eventType, listener, component) => {

  const type = eventType.toLocaleLowerCase().slice(2);
  const eventStore = dom.eventStore || (dom.eventStore = {});
  eventStore[type] = { listener, component };
    
  document.addEventListener(type, dispatchEvent, false);
}

const dispatchEvent = (event) => {

  let { type, target } = event;
    
  // 模拟冒泡
  while (target) {
    const { eventStore } = target;
    if (eventStore) {
      const { listener, component } = eventStore[type];
      if (listener) {
          
        component.isBatchingUpdate = true;
          
        listener.call(null, event);
          
        component.isBatchingUpdate = false;
          
        component.forceUpdate();
      }
    }
    target = target.parentNode;
  }
}
```

## 3. setState()

`setState` 会把第一个参数存到一个队列中，当事件结束后再执行，会异步更新和合并更新。以下是几个例子：

```js
this.setState({ num: this.state.num + 1 });
console.log(this.state.num);

this.setState({ num: this.state.num + 1 });
console.log(this.state.num);
// result: 0 0 num = 1, 状态更新合并, 事件执行结束后再统一更新
```

```js
this.setState({ num: this.state.num + 1 }, () => {
  console.log(this.state.num);
});

this.setState({ num: this.state.num + 1 }, () => {
  console.log(this.state.num);
});
// result: 1 1 num = 1, setState 第二个参数可以为一个函数，在状态更新后执行。
```

```js
this.setState(state => ({num: state.num + 1}), () => {
    console.log(this.state.num);
});
console.log(this.state.num);

this.setState(state => ({num: state.num + 1}), () => {
    console.log(this.state.num);
});
console.log(this.state.num);
// result: 0 0 2 2 num = 2, setState 支持传入一个函数, 函数接收前一个 state 作为参数，返回新 state
```

核心实现如下：

```js
// react.js
class Component {
  static isReactComponent = true;

  constructor(props) {
    this.props = props;

    // 临时更新队列
    this.updateQueue = [];
    this.callbacks = [];

    // 是否处于批量更新模式
    this.isBatchingUpdate = false;
  }

  setState(partialState, callback) {
	
    // 放入队列
    this.updateQueue.push(partialState);
    callback && this.callbacks.push(callback);

    if (!this.isBatchingUpdate) {
      this.forceUpdate();
    }
  }
  forceUpdate() {
	if (this.updateQueue.length == 0) return;
    // 更新 state
    this.state = this.updateQueue.reduce((preState, currUpdate) => {
      const newState = typeof currUpdate === 'function' ? currUpdate(preState) : currUpdate;
      return { ...preState, ...newState }
    }, this.state)

    // 清空队列
    this.updateQueue.length = 0;

    // 重新渲染
    ReactDOM.updateComponent(this);

    // 执行回调
    this.callbacks.forEach(callback => callback());
    this.callbacks.length = 0;
  }
}

// 重新渲染
const updateComponent = (component) => {
const element = component.render(component.props);
const newDom = createDOM(element, component);
const oldDom = component.dom;
oldDom.parentNode.replaceChild(newDom, oldDom);

// 更新组件对应的真实 DOM
component.dom = newDom;
}


// react-dom.js

// 重新渲染
const updateComponent = (component) => {

  const element = component.render(component.props);
    
  const newDom = createDOM(element, component);
  const oldDom = component.dom;
    
  oldDom.parentNode.replaceChild(newDom, oldDom);

  // 更新组件对应的真实 DOM
  component.dom = newDom;
}

```

## 4. ref

### 4.1 普通 DOM 的 ref

ref 有如下三种使用方式：

1. 使用字符串 (不推荐)

   ```js
   // 声明
   <input ref="a" />
   
   // 使用
   this.refs.a    
   ```

2. 使用函数 (不推荐)

   ```js
   // 声明
   <input ref = {input => this.a = input} />
   
   // 使用
   this.a
   ```

3. 使用对象（推荐）

   ```js
   // 声明
   this.a = React.createRef();
   <input ref = {this.a}/>
   
   // 使用
   this.a.current;
   ```

代码实现如下：

```js
case key === 'ref':
if (typeof value === 'string') {
  component.refs[value] = dom;
} else if (typeof value === 'function') {
  value.call(component, dom);
} else if (typeof value === 'object'){
  value.current = dom;
}
```

### 4.2 类组件的 ref

类组件也可以使用 ref，如：

```js
// class Form
getFocus = () => this.textInput.current.handleFocus();

<div>
  <TextInput ref={this.textInput}>
  <button onClick={this.getFocus}>focus</button>
</div>


// class TextInput
handleFocus = () => this.input.current.focus();
<input ref={this.input}>

```

代码实现：

```js
if (props.ref) {
  props.ref.current = component;
}
```

### 4.3 函数组件的 ref

使用 `forwardRef` 转发

```js
const TextInput2 = React.forwardRef((props, ref) => React.createElement('input', {ref}));

<TextInput2 ref={this.textInput}>
```

代码实现如下:

```js
const forwardRef = (FunctionComponent) => {
  return class extends Component {
    render() {
      return FunctionComponent(this.props, this.props.ref);
    }
  }
}
```

## 5. 生命周期

### 5.1  getDerivedStateFromProps(nextProps, prevState)

该方法主要用于把父组件传递的属性映射到当前组件的状态。方法为静态方法，接收两个参数，第一个是父组件传递的属性对象，第二个是组件当前的状态对象，返回值为组件新的状态对象。

```js
static getDerivedStateFromProps(nextProps, prevState) {
	return { count: nextProps.count };
}
```

### 5.2 getSnapShotBeforeUpdate()

该方法主要用于阻止滚动列表内容变化后页面发生的滚动。该方法的返回值会传递给 `componentDidUpdate` 的第三个参数。

```js
class ScrollList extends React.Component {

  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.scrollList = React.createRef();
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ messages: [`${this.state.messages.length}`, ...this.state.messages] });
    }, 500);
  }

  getSnapshotBeforeUpdate() {
    return this.scrollList.current.scrollHeight;
  }

  componentDidUpdate(prevProps, prevState, prevScrollHeight) {
    const scrollDOM = this.scrollList.current;
    const deltaHeight = scrollDOM.scrollHeight - prevScrollHeight;
    scrollDOM.scrollTop += deltaHeight;
  }

  render() {

    const styleObj = {
      width: '100px',
      height: '100px',
      border: '1px solid',
      overflow: 'auto',
    };

    return (
      <div style={styleObj} ref={this.scrollList}>
        {
          this.state.messages.map((item, index) => (
            <div key={index}>{item}</div>
          ))
        }
      </div>
    )
  }
}
```

## 6. context

### 6.1 定义：

```jsx
const ThemeContext = React.createContext();
<ThemeContext.Provider value={value}>
  <Header />
  <Main/>
</ThemeContext.Provider>
```

### 6.2 使用:

```jsx
// 方式一：
static contextType = ThemeContext;

render() {
  return (
    <div style={{border: `1px solid ${this.context.color}`}}>
    <Title/>
    </div>
  )
}


// 方式二：
<ThemeContext.Consumer>
  {context => (
    <div style={{border: `1px solid ${context.color}`}}>
    <Content/>
    </div>
  )}
</ThemeContext.Consumer>
```

### 6.3 实现

```js
// 方式一
if (type.contextType) {
 component.context = type.contextType.Provider.value;
}


// 方式二
const createContext = () => {
  const Provider = (props) => {
    Provider.value = props.value;
    return props.children;
  }

  const Consumer = (props) => {
    return props.children(Provider.value);
  }

  return { Provider, Consumer };
}
```

## 7. react-router

### 7.1 使用

```js
import {
  HashRouter as Router,
  Route,
} from './lib/react-router-dom';

<Router>
  <Route path="/" component={Home} exact />
  <Route path="/user" component={User} />
  <Route path="/profile" component={Profile} />
</Router>
```

### 7.2 HashRouter 实现

1. 创建了一个包含`location.hash  `的`Context` 
2. 监听  `onhashchange` 事件，实时更新`context.pathname`

```js
import React from 'react';
import { Provider } from './context';


export default class HashRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pathname: location.hash.slice(1) || '/',
    };
  }
  componentDidMount() {
    // 默认跳转到 '/'
    location.hash = location.hash.slice(1) ? location.hash.slice(1) : '/';

    // 实时更新 conetxt.hash
    window.addEventListener('hashchange', () => {
      const pathname = location.hash.slice(1) ? location.hash.slice(1) : '/';
      this.setState({ pathname });
    });
  }
  render() {
    const value = {
      location: {
        pathname: this.state.pathname,
      },
    };
    return (
      <Provider value={value}>
        {this.props.children}
      </Provider>
    );
  }
}
```

### 7.3 Route 实现

1. 比较 `context.pathname` 与 `props.path` 决定是否渲染组件
   1. 默认非精确比较，可给 `Route` 添加 `exact` 实现精准比较

```js
import React from 'react';
import { Consumer } from './context.js';
import { pathToRegexp } from 'path-to-regexp';

export default class Route extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Consumer>
        {
          (context) => {
            const { location } = context;
            const { pathname } = location;
            const { path, component: Component, exact = false } = this.props;
            const regexp = pathToRegexp(path, [], { end: exact });
            if (regexp.test(pathname)) {
              return <Component location={location} />;
            }
            return null;
          }
        }
      </Consumer>
    );
  }
}
```

### 7.4 Link 实现

1. 渲染一个 a 标签， a 标签的 click 事件指向 `context.history.push`

```js
export default class Link extends React.Component {
  static contextType = RouteContext;

  handleClick = () => {
    const { history } = this.context;
    history.push(this.props.to);
  }

  render() {
    return (
      <a onClick={this.handleClick}>{this.props.children}</a>
    );
  }
}


// context.history
push(to) {
  if (typeof to === 'object') {
    const { pathname, state } = to;
    location.hash = pathname;
    this.locationState = state;
  } else if (typeof to === 'string') {
    location.hash = to;
  }
},
```

### 7.5 Switch 实现

1. 遍历 `Switch.children`， 渲染第一个匹配项
2. path 默认值为 `/` ， 便于重定向

```js
export default class Switch extends React.Component {
  static contextType = RouteContext;

  render() {
    const { pathname } = this.context.location;
    const children = [].concat(this.props.children);
    for (const child of children) {
      const { path = '/', exact = false } = child.props;
      const regexp = pathToRegexp(path, [], { end: exact });
      if (regexp.test(pathname)) {
        return child;
      }
    }
    return null;
  }
}
```

### 7.6 Redirect 实现

如果不存在 `from` 属性 ，或者 `from` 指定的值与当前页面 `pathname` 相同，则跳转到 `to` 指定路径

```js
export default class Redirect extends React.Component {
  static contextType = RouteContext;

  render() {
    const { from, to } = this.props;
    const { pathname } = this.context.location;
    if (from === undefined || from === pathname) {
      this.context.history.push(to);
    }
    return null;
  }
}
```

### 7.7 路由参数实现

1. 使用 `Link` 时可以传递 `state`, 这个 `state` 会保存在 `this.props.location.state` 中
2. 使用 `/:name` 可以保存 `url` 中的参数，然后在`this.props.match.params` 中读取

```js
// state 实现
push: (to) => {
  if (typeof to === 'object') {
    const { pathname, state } = to;
    location.hash = pathname;
    this.locationState = state;
  } else if (typeof to === 'string') {
    location.hash = to;
  }
}

this.setState((state) => ({
  location: {
    ...state.location,
    pathname,
    query,
    state: this.locationState || state.location.state,
  },
}));

// params 实现
export default class Route extends React.Component {
  render() {
    return (
      <Consumer>
        {
          (context) => {
            const { location } = context;
            const { pathname } = location;
            const { path = '', component: Component, exact = false } = this.props;
            const params = [];
            const regexp = pathToRegexp(path, params, { end: exact });
            const result = pathname.match(regexp);
            if (result) {
              const [url, ...values] = result;
              const paramsName = params.map(param => param.name);
              const match = {
                url,
                params: paramsName.reduce((obj, name, index) => {
                  obj[name] = values[index];
                  return obj;
                }, {}),
                isExact: url === pathname,
              };
              return <Component {...context} match={match} />;
            }
            return null;
          }
        }
      </Consumer>
    );
  }
}


```

### 7.8 保护路由实现

实现的关键点在与可以给 `<Route>` 传递一个函数类型的属性 `render`， 如下：

```js
<Route
  path="/profile"
  render={
    (props) => {
      if (sessionStorage.getItem('login')) {
        return <h1>Profile</h1>;
      } else {
        return <Redirect to={{ pathname: '/login', state: { from: this.props.location.pathname } }} />;
      }
    }
  }
/>
```

实现如下：

```js
if (this.props.component) {
  return <Component {...context} match={match} />;
} else if (this.props.render) {
  // 如果存在 render 属性则执行该函数
  return this.props.render({ ...context, match });
}
```

### 7.9 NavLink 实现

1. 借助 `Route` 判断路径是否匹配， 如果匹配会给 `props.match` 赋值
2. 如果 `props.match`存在，则给 `Link`添加 `active` 类名

```js
return (
  <>
    <Route
      path={to}
      exact={exact}
      children={
        (props) => (
          <Link
            to={props.path}
            exact={props.exact}
            className={props.match ? 'active' : ''}
          >
            {this.props.children}
          </Link>
        )
      }
    />
  </>
);
```

### 7.10 withRouter 实现

`withRouter` 是一个高阶组件，给传入的组件提供路由属性

```js
const withRouter = (OldComponent) => (
  props => (
    <Route
      render={
        routeProps => <OldComponent {...routeProps} {...props} />
      }
    />
  )
);
```

### 7.11 Prompt 实现

`Prompt` 组件接收两个属性，第一个是代表是否显示提示的布尔型 `when`，第二个是一个接收 `location` 参数的函数`message`，函数返回值为提示信息。`Prompt` 组件使用示例如下：

```js
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
```

`Prompt`主要借助`history.block` 实现，具体实现如下：

```js
// Prompt.js
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

// HashRouter.js
history: {
  push: (to) => {
    if (this.message) {
      const result = window.confirm(this.message(typeof to === 'object' ? to : { pathname: to }));
      if (!result) return;
    }
  },
  block: (message) => {
    this.message = message;
  },
},
```

### 7.12 BrowserRouter 实现

与 `HashRouter`大体类似，只是使用 `window.history`实现导航

```js
import React from 'react';
import { Provider } from './context';


export default class BrowserRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        pathname: '/',
        state: null,
      },
    };
  }
  componentDidMount() {
    // 劫持 history.pushState, 当添加时触发 window.onpushstate 事件
    !(function (history) {
      const { pushState } = history;
      history.pushState = (state, title, pathname) => {
        if (typeof window.onpushstate === 'function') {
          window.onpushstate(state, pathname);
        }
        return pushState.call(history, state, title, pathname);
      };
    })(window.history);

    window.onpushstate = (state, pathname) => {
      this.setState({
        location: {
          ...this.state.location,
          pathname,
          state,
        },
      });
    };

    window.onpopstate = (event) => {
      this.setState({
        location: {
          ...this.state.location,
          pathname: document.location.pathname,
          state: event.state,
        },
      });
    };
  }
  render() {
    const value = {
      location: this.state.location,
      history: {
        location: this.state.location,
        push: (to) => {
          if (this.message) {
            const result = window.confirm(this.message(typeof to === 'object' ? to : { pathname: to }));
            if (!result) return;
          }
          if (typeof to === 'object') {
            const { pathname, state } = to;
            window.history.pushState(state, '', pathname);
          } else if (typeof to === 'string') {
            window.history.pushState(null, '', to);
          }
        },
        block: (message) => {
          this.message = message;
        },
      },
    };
    return (
      <Provider value={value}>
        {this.props.children}
      </Provider>
    );
  }
}

```

## 8. redux

### 8.1 实现 createStore

1. `createStore` 是一个函数，接收两个参数，第一个是 `reducer`， 第二个是 `preloadedState`
2. `createStore` 返回一个对象，包含以下三个函数：
   1. `getState()`返回当前 `state`
   2. `subscribe()` 订阅`dispatch` 事件
   3.  `dispatch(action)` 分发事件

```js
const createStore = (reducer, preloadedState) => {
  let state = preloadedState;
  const listeners = [];

  const getState = () => {
    return state;
  };

  const subscribe = (listener) => {
    listeners.push(listener);

    // 返回取消订阅的函数
    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());

    // 返回 action
    return action;
  };

  // 初始化 state
  dispatch({ type: '@@redux/INIT' });

  return {
    getState,
    subscribe,
    dispatch,
  };
};
```

### 8.2 实现 bindActionCreators

`bindActionCreators(actionCreators, dispatch)`， 该函数接受i两个参数，第一个参数为包含多个 actionCreator 的对象，或者单个 actionCreator 对象，第二个参数为 `store.dispatch`

函数返回新的函数，函数中调用 dispath 分发 action

```js
const bindActionCreator = (actionCreator, dispatch) => {
  return (...params) => dispatch(actionCreator.apply(null, params));
};


const bindActionCreators = (actionCreators, dispatch) => {
  if (typeof actionCreators === 'object') {
    const result = {};
    for (const key in actionCreators) {
      const actionCreator = actionCreators[key];
      result[key] = bindActionCreator(actionCreator, dispatch);
    }
    return result;
  } else if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }
};

```

### 8.3 实现 combineReducers

`combineReducers(reducers)` 接收一个包含多个 reducer 的对象作为参数。函数返回组合后的 reducer 函数

```js
const combineReducers = (reducers) => {
  return (state, action) => {
    const nextState = {};

    const keys = Object.keys(reducers);

    for (const key of keys) {

      // 使用对应的 reducer 和 state 更新状态
      const reducer = reducers[key];
      const stateForKey = state[key];
      nextState[key] = reducer(stateForKey, action);
    }

    return nextState;
  };
};
```

### 8.4 实现 react-redux

##### 8.4.1 Provider

`Provider` 是一个函数组件，接收一个`store` 属性，借助 `context` 给所有子组件提供 `store`

```js
export default class Provider extends React.Component {
  render() {
    return (
      <RouteContext.Provider value={this.props.store}>
        {this.props.children}
      </RouteContext.Provider>
    );
  }
}
```

##### 8.4.2 connect

`connect(mapStateToProps, mapDispatchToProps)` 接收两个参数，第一个参数为接收一个`state` 参数的函数，第二个参数为一个包含多个 `actionCreator` 的对象。`connect` 返回一个高阶组件，高阶组件包装老组件，做了以下事情：

1. 在 `componentDidMount` 中订阅事件，在 `componentWillUnMount`中取消订阅
2. 调用 `mapStateToProps(this.state)` 把 redux 保存的状态映射到被包装组件的属性
3. 调用 `bindActionCreators(mapDispatchToProps, this.context.dispatch)` 返回多个函数，函数会自动分发  action，并将这些函数映射到被包装组件的属性

```js
const connect = (mapStateToProps, mapDispatchToProps) => {
  return (OldComponent) => {
    return class extends React.Component {
      // 接收 context
      static contextType = RouteContext;

      constructor(props, context) {
        super(props);
        this.state = context.getState();
      }

      componentDidMount() {
        // 订阅事件  
        this.unsubscribe = this.context.subscribe(() => {
          this.setState(this.context.getState());
        });
      }

      componentWillUnmount() {
        // 取消订阅
        this.unsubscribe();
      }

      render() {
        return (
          // 映射属性  
          <OldComponent
            {...mapStateToProps(this.state)}
            {...bindActionCreators(mapDispatchToProps, this.context.dispatch)}
          />
        );
      }
    };
  };
};
```

### 8.5 applyMiddleware 实现

#### **8.5.1 applyMiddleware **

##### 8.5.1.1 applyMiddleware 基本结构

- `applyMiddleware` 是一个函数，接收一个中间件数组作为参数，返回一个函数
  - 返回的函数接收 `createStore` 作为参数，返回一个函数
    - 返回的函数接收 `combineReducers` 作为参数，函数体内使用中间件拓展`store.dispatch`，返回新 `store`



```js
const applyMiddleware = (...middlewares) => (createStore) => (combineReducers) => {
  const store = createStore(combineReducers);
  
  // 拓展dispatch
    
  return {
      ...store,
      dispatch,
  };
};
```

##### 8.5.1.2 实现 applyMiddleware

1. 柯里化 middlewares
2. 组合 middleware

```js
const applyMiddleware = (...middlewares) => (createStore) => (combineReducers) => {
  const store = createStore(combineReducers);

  let dispatch = null;
  
  // 柯里化 middlewares
  const middlewareAPI = {
    getState: store.getState,
    dispatch: (...args) => dispatch(...args),
  };
  const chain = middlewares.map(middleware => middleware(middlewareAPI));
  
  // 组合 midleware, 方式一
  dispatch = compose(...chain)(store.dispatch);
  
  // 组合 middleware, 方式二
  // const [thunk, promise, logger] = chain;
  // dispatch = thunk(promise(logger(store.dispatch)));
  
  return {
    ...store,
    dispatch,
  };
};

const compose = (...fns) => fns.reduce((a, b) => (...args) => b(a(...args)));
```



#### **8.5.2 中间件**

##### 8.5.2.1 中间件基本结构

- 所有的中间件都是一个函数，函数接收 `{ getState, dispatch } ` 作为参数，返回一个函数
  - 返回的函数接收 `next` 作为参数，返回一个函数
    - 返回的函数接收 `action` 作为参数，函数体内执行中间件方法

 ```js
const middleware = ({ getState, dispatch }) => (next) => (action) => {
  // 中间件方法
  dispatch(action);
};
 ```

##### 8.5.2.2 thunk

```js
const thunk = ({ getState, dispatch }) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(dispatch);
  } else {
    next(action);
  }
};
```

##### 8.5.2.3 promise

```js
const promise = ({ getState, dispatch }) => (next) => (action) => {
  if (action.payload && typeof action.payload.then === 'function') {
    action.payload.then(
      data => dispatch({ ...action, payload: { value: data } }),
      err => dispatch({ ...action, payload: { value: err }, err: true }),
    );
  } else {
    next(action);
  }
};

```

##### 8.5.2.4 logger

```js
const logger = ({ getState, dispatch }) => (next) => (action) => {
  console.log('prev', getState());
  next(action);
  console.log('after', getState());
};
```