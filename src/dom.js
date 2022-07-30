import { VNormalNode, VTextNode, VComponentNode } from './vnode';

function createElement(vnode) {
  let element = null;
  if (vnode instanceof VTextNode) {
    vnode.element = document.createTextNode(vnode.text);
  } else if (vnode instanceof VNormalNode) {
    vnode.element = document.createElement(vnode.tag);
  } else if (vnode instanceof VComponentNode) {
    // 组件节点
    const componentRenderNode = vnode.renderVNode;
    createElement(componentRenderNode);
  }
}

export {
createElement
}