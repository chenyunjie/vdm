import { VNormalNode, VTextNode, VComponentNode, RenderNode } from './vnode';

/**
 * 根据虚拟节点创建dom节点
 * @param {*} vnode 
 */
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

/**
 * 移除dom节点
 * @param {*} vnode 
 */
function removeElement(vnode) {
  if (vnode.element) {
    vnode.element.remove();
  }
}

/**
 * 节点替换
 * @param {*} vnode 
 * @param {*} replacement 
 */
function replaceElement(vnode, replacement) {

  if (vnode instanceof RenderNode && replacement instanceof RenderNode) {
    if (vnode.element && replacement.element) {
      vnode.element.replaceWith(replacement.element);
    }
  }
 
}

export {
  createElement,
  removeElement,
  replaceElement
}