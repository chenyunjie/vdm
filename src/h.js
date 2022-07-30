import { VNormalNode, VTextNode } from './vnode';
import { Component } from './component';
import { isFunctionType } from './utils';
let id = 1;

function h(tag, attr, children) {
  let node = new VNormalNode(tag, attr, children);
  node.id = ++id;
  if (children && children.length > 0) {
    const newChildren = children.map(child => {

      if (child instanceof Component) {

        // 根据组件中的是否需要渲染组件进行判断, 首次渲染不调用 shouldComponentUpdate 函数
        let isNeedRender = true;
        if (child.shouldComponentUpdate && isFunctionType(child.shouldComponentUpdate)) {
          isNeedRender = child.shouldComponentUpdate.apply(child, []);
        }

        if (isNeedRender) {
          const renderedVNode = child.render();

          // 指定组件的渲染内容
          child.renderVNode = renderedVNode;
          // 指定节点所属组件
          renderedVNode.holder = child;
          // 设置当前组件节点的父级节点
          child.parent = node;
        }

        

      } else if (child instanceof VNormalNode || child instanceof VTextNode) {
        child.parent = node;
      }

      return child;
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