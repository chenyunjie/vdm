import { VNode, VTextNode } from './vnode';
import { Component } from './component';
let id = 1;

function h(tag, attr, children) {
  let node = new VNode(tag, attr, children);
  node.id = ++id;
  if (children && children.length > 0) {
    const newChildren = children.map(child => {

      let renderedVNode = null;
      if (child instanceof Component) {
        if (child.isdirty === false) {
          renderedVNode = child._vnode;
        } else {
          renderedVNode = child.render();
          renderedVNode.component = child;
          renderedVNode._parent = node;
        }
      
      } else if (child instanceof VNode || child instanceof VTextNode) {
        renderedVNode = child;
        renderedVNode._parent = node;
      }

      return renderedVNode;
    });

    node.children = newChildren;
  }
  return node;
}

function text(content) {
  let node = new VTextNode(content);
  node.id = ++id;
  return node;
}

export {
  h,
  text
}