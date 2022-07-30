import { VNormalNode, VTextNode } from './vnode';
import { createElement } from './dom';
import { h, text } from './h';
import { Component } from './component';
import { diff, patch } from './diff';

function renderVNode(rootElement, vnode) {
  if (rootElement) {
    createElement(vnode);
    rootElement.appendChild(vnode.element);
  }
}

/**
 * 初始化渲染
 * 
 * @param {*} rootElement 
 * @param {*} component 
 */
function render(rootElement, component) {

  // 初始化根组件节点
  const newVNode = component.render();
  // 首次加载，初始化根节点
  const rootNode = h(rootElement.tagName, {}, [component]);
  rootNode.element = rootElement;

  // 设置组件父节点
  component.parent = rootNode;

  // 设置节点所属组件
  newVNode.holder = component;
  const patches = diff(newVNode, null, rootNode);

  // 应用diff内容
  patch(patches);

  component.renderVNode = newVNode;
}


export {
  VNormalNode,
  VTextNode,
  renderVNode,
  h,
  text,
  Component,
  render
}