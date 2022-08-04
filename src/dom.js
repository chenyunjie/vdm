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

/**
 * 追加元素
 * 
 * @param {*} parentVNode 
 * @param {*} childVNode 
 */
function appendChild(parentVNode, childVNode) {
  if (parentVNode && childVNode && parentVNode.element && childVNode.element) {
    childVNode.parent = parentVNode;
    parentVNode.element.appendChild(childVNode.element);
  }
}

/**
 * 设置属性值
 * 
 * @param {*} element 
 * @param {*} attrName 
 * @param {*} attrValue 
 */
function setAttr(element, attrName, attrValue='') {
  if (element && attrName) {
    element.setAttribute(attrName, attrValue);
  }
}

/**
 * 移除属性
 * @param {*} element 
 * @param {*} attrName 
 */
function removeAttr(element, attrName) {
  if (element && attrName) {
    element.removeAttribute(attrName);
  }
}

export {
  createElement,
  removeElement,
  replaceElement,
  appendChild,
  setAttr,
  removeAttr
}