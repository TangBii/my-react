const createElement = (type, config = {}, ...children) => {
  return {
    type,
    props: { ...config, children }
  }
}

class Component {
  static isReactComponent = true;

  constructor(props) {
    this.props = props;
  }
}


export default {
  createElement,
  Component,
}