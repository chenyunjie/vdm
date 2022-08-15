import { VNormalNode, VTextNode } from './vnode';
import { Component } from './component';
import { isArrayType, isFunctionType, isNumberType, isStringType } from './utils';
let id = 1;

function h(tag, attr, children) {
  let node = new VNormalNode(tag, attr, children);
  node.id = ++id;
  if (children && children.length > 0) {

    const flatedChildren = flatDeep(children, Infinity);

    const newChildren = flatedChildren.map(child => {
      let newChildNode = child;
      if (newChildNode instanceof Component) {

        // 根据组件中的是否需要渲染组件进行判断, 首次渲染不调用 shouldComponentUpdate 函数
        let isNeedRender = true;
        if (newChildNode.shouldComponentUpdate && isFunctionType(newChildNode.shouldComponentUpdate)) {
          isNeedRender = newChildNode.shouldComponentUpdate.apply(newChildNode, []);
        }

        if (isNeedRender) {
          const renderedVNode = newChildNode.render();

          // 指定组件的渲染内容
          newChildNode.renderVNode = renderedVNode;
          // 指定节点所属组件
          renderedVNode.holder = newChildNode;
        }
      } else if (isStringType(child) || isNumberType(child)) {
        // 字符串类型
        newChildNode = text(child);
      }

      newChildNode.parent = node;
      return newChildNode;
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

function flatDeep(arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
               : arr.slice();
}

export {
  h,
  text
}