import { VNode, VTextNode } from './vnode';

function createElement(vnode) {
  let element = null;
  if (vnode instanceof VTextNode) {
    vnode._el = document.createTextNode(vnode.text);
  } else if (vnode instanceof VNode) {
    vnode._el = document.createElement(vnode.tag);
  }
}

export {
createElement
}