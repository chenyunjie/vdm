import { createElement } from './dom';
import { diff, patch } from './diff';

class Component extends Object {

  _vnode;

  _root;

  constructor(props) {
    super();

    if (!props) {
      props = {};
    }

    this.props = JSON.parse(JSON.stringify(props));
  }

  setData(data, complete) {
    
    this.data = Object.assign({}, this.data, data);

    this.isdirty = true;

    this.children.map(component => {
      if (component.props) {
        const componentPropsKeys = Object.keys(component.props);
        const dataKeys = Object.keys(data);
        // 需要比较
        component.isdirty = dataKeys.some((dataKey) => componentPropsKeys.indexOf(dataKey) >= 0);
      }
    });

    if (this.render) {
      const newVNode = this.render();
      if (newVNode) {
        newVNode.component = this;
      }
      const patches = diff(newVNode, this._vnode, this._vnode._parent);

      patch(patches);

      this._vnode = newVNode;
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
    newVNode.component = this;
    const patches = diff(newVNode, null, this._vnode._parent);
    patch(patches);
  }

  get children() {
    if (this._vnode.children && this._vnode.children.length > 0) {
      return this._vnode.children.filter(child => !!child.component).map(child => child.component);
    }
    return [];
  }
}

export {
  Component
}