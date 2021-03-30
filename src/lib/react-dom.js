const render = (element, container) => {

  // 1. 文本类型
  if (typeof element === 'string' || typeof element === 'number') {
    return container.appendChild(document.createTextNode(element));
  }

  // 2. 函数/类组件
  if (typeof element.type === 'function') {
    const { type, props } = element;
    element = type.isReactComponent ? new type(props).render() : type(props);
  }
  // 3. react 元素
  container.appendChild(createDOM(element));
}

// 生成真实 DOM
const createDOM = (element) => {

  const { type, props } = element;
  const { children, ...attrs } = props;

  // 创建真实 DOM
  const dom = document.createElement(type);

  // 添加属性
  for (const key in attrs) {
    const value = attrs[key];

    // 处理特殊属性，className, style 等  
    switch (key) {
      case 'className':
        dom.className = value;
        break;
      case 'style':
        const styles = value;
        for (const key in styles) {
          dom.style[key] = styles[key];
        }
        break;
      default:
        dom.setAttribute(key, value);
    }
  }

  // 递归渲染
  children.forEach(child => render(child, dom));

  return dom;
}


export default {
  render,
}