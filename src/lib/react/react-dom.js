// component 要逐层传递下去，绑定合成事件时会用到
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

      // 类组件的 ref
      if (props.ref) {
        props.ref.current = component;
      }

      if (type.contextType) {
        component.context = type.contextType.Provider.value;
      }

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

  // 创建真实 DOM 元素
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
        addEvent(dom, key, value, component);
        break;
      case key === 'ref':
        if (typeof value === 'string') {
          component.refs[value] = dom;
        } else if (typeof value === 'function') {
          value.call(component, dom);
        } else if (typeof value === 'object'){
          value.current = dom;
        }
      default:
        dom.setAttribute(key, value);
    }
  }

  // 递归渲染
  if (Array.isArray(children)) {
    children.forEach(child => render(child, dom, component));
  } else if (children) {
    render(children, dom, component)
  }

  return dom;
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

export default {
  render,
  updateComponent,
}