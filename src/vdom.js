import { VNode, VTextNode } from './vnode';
import { createElement } from './dom';
import { h, text } from './h';
import { Component } from './component';
import { diff, patch } from './diff';

function renderVNode(rootElement, vnode) {
  if (rootElement) {
    createElement(vnode);
    rootElement.appendChild(vnode._el);
  }
}

function render(rootElement, component) {
  component._root = rootElement;
  const newVNode = component.render();
  const rootNode = h(rootElement.tagName, {}, [component]);
  rootNode._el = rootElement;

  newVNode.component = component;
  const patches = diff(newVNode, null, rootNode);

  patch(patches);

  component._vnode = newVNode;
}


export {
  VNode,
  VTextNode,
  renderVNode,
  h,
  text,
  Component,
  render
}