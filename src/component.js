import { createElement } from './dom';
import { diff, patch } from './diff';
import { VComponentNode } from './vnode';

class Component extends VComponentNode {

  refs;

  constructor(props) {
    super();
    this.refs = {};
    if (!props) {
      props = {};
    }
    
    this.props = JSON.parse(JSON.stringify(props));
  }

  propsChanged(newProps, oldProps) {

  }

  shouldComponentUpdate() {

  }

  setData(data, complete) {
    
    this.data = Object.assign({}, this.data, data);

    if (this.render) {
      const newVNode = this.render();
      if (newVNode) {
        newVNode.holder = this;
      }
      const patches = diff(newVNode, this.renderVNode, this.parent);

      patch(patches);

      this.renderVNode = newVNode;
    }
    if (complete) {
      complete.apply(this, []);
    }
  }

  render() {
    return null;
  }

  forceUpdate() {
    const newVNode = this.render();
    newVNode.holder = this;
    const patches = diff(newVNode, null, this.parent);
    patch(patches);
  }

  get children() {
    if (this.renderVNode) {
      return this.renderVNode.children;
    }
    return [];
  }

  get element() {
    if (this.renderVNode) {
      return this.renderVNode.element;
    }
    return null;
  }

  set element(newElement) {
    if (this.renderVNode) {
      this.renderVNode.element = newElement;
    }
  }
}

// 向上查找 component 
function findDirectParentComponent(node) {
  if (node) {
    if (node.parent) {
      if (node.parent.holder) {
        return node.parent.holder;
      } else {
        return findDirectParentComponent(node.parent);
      }
    }
  }
  return null;
}

export {
  Component
}