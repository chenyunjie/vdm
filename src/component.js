import { createElement } from './dom';
import { diff } from './diff';
import { VComponentNode } from './vnode';
import { patch } from './patch';
import { isFunctionType } from './utils';

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

/**
 * 根据配置构建Component实例
 * @param {*} config 
 *  config : {
 *    lifetime: {
 *      created: function() {},
 *      attached: function() {},
 *      destroyed: function() {}
 *    },
 *    properties: {
 *          
 *    }
 *  }
 */
function BuildComponent(config, CC) {
  const component = new CC(config.properties);

  const { lifetime } = config;

  if (lifetime) {
    let { created, attached, destroyed } = lifetime;

    if (created && isFunctionType(created)) {
      created.apply(component, []);
    }

    if (attached && isFunctionType(attached)) {
      attached = attached.bind(component);
      component.mounted = attached;
    }

    if (destroyed && isFunctionType(destroyed)) {
      destroyed = destroyed.bind(component);
      component.unmounted = destroyed;
    }
  }

  return component;
}

export {
  Component,
  BuildComponent
}