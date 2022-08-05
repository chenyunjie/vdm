
import { appendChild, createElement, removeAttr, removeElement, replaceElement, setAttr } from "./dom";
import { event, isEventAttr, parseEventAttr, unbindAllEvent, unbindEvent } from "./event";
import { lifecycleMounted, lifecycleUnmounted } from "./lifecycle";
import { isFunctionType } from "./utils";
import { VComponentNode, VTextNode } from './vnode';

const PatchType = {
  // 替换节点
  REPLACE: 1,

  // 删除节点
  REMOVE: 2,

  // 追加节点
  APPEND: 3,

  // 移动节点
  MOVE: 5,

  // 移除所有
  REMOVE_ALL: 6,

  // 属性移除
  REMOVE_ATTR: 7,

  // 属性添加
  ADD_ATTR: 8,

  // 替换属性
  REPLACE_ATTR: 9
};

/**
 * 应用变更
 * @param {*} patches 
 */
function patch(patches) {
  patches.forEach(patch => {
    const { newVNode, oldVNode, parentNode } = patch;
    switch(patch.type) {
      case PatchType.APPEND:

        // 追加dom节点
        if (parentNode && parentNode.element) {

          // 创建真实dom节点
          createElement(newVNode);

          // 设置属性
          setInitialAttr(newVNode);

          // 追加节点
          appendChild(parentNode, newVNode);

          // 调用组件生命周期函数
          lifecycleMounted(newVNode);

          // 绑定新事件
          bindEventForVNode(newVNode);
          
          // 创建子元素
          createChildren(newVNode);
        }
        break;
      case PatchType.MOVE:
        break;
      case PatchType.REMOVE:
        if (oldVNode.element) {
          // 移除元素上的所有事件
          unbindAllEvent(oldVNode.element);

          // 移除dom元素
          removeElement(oldVNode);
        }

        // 组件卸载
        lifecycleUnmounted(oldVNode);
        break;
      case PatchType.REPLACE:

        /// 完成元素节点替换
        createElement(newVNode);

        if (newVNode.element && oldVNode.element) {
          newVNode.parent = parentNode;
          replaceElement(oldVNode, newVNode);
        }

        // 设置元素属性
        setInitialAttr(newVNode);

        /// 完成组件生命周期

        // 新组件加载
        lifecycleMounted(newVNode);

        // 旧组件卸载
        lifecycleUnmounted(oldVNode);
        
        /// 事件处理

        // 删除旧元素事件
        if (oldVNode && oldVNode.element) {
          // 移除元素上的所有事件
          unbindAllEvent(oldVNode.element);
        }

        // 绑定新事件
        bindEventForVNode(newVNode);

        /// 处理子组件
        createChildren(newVNode);

        break;
      case PatchType.REPLACE_ATTR:

      case PatchType.ADD_ATTR:
        // 添加/替换属性
        if (newVNode.element) {
          const { attrKey, value } = patch;

          if (isEventAttr(attrKey)) {

            if (oldVNode && oldVNode.element) {
              const { eventType } = parseEventAttr(attrKey);
              unbindEvent(oldVNode.element, eventType);
            }
  
            // 绑定新事件
            bindEventForVNode(newVNode);
          } else {
            // 设置属性
            setAttr(newVNode.element, attrKey, value);
          }
        }
        break;
      case PatchType.REMOVE_ATTR:
        // 属性移除
        if (newVNode.element) {
          const { attrKey } = patch;

          // 删除属性
          removeAttr(newVNode.element, attrKey);

          // 如果是事件则移除dom事件
          if (isEventAttr(key)) {
            if (oldVNode && oldVNode.element) {
              const { eventType } = parseEventAttr(attrKey);
              // 移除元素上的所有事件
              unbindEvent(oldVNode.element, eventType);
            }
          }
        }
    }
  });
}

function createChildren(node) {
  // 处理子元素
  if (node.element && node.children && node.children.length > 0) {
    node.children.forEach(child => {
      
      // 创建dom节点
      createElement(child); 

      // 设置节点属性
      setInitialAttr(child);

      // 为元素绑定事件
      bindEventForVNode(child);

      // 追加元素
      appendChild(node, child);

      // 组件加载
      lifecycleMounted(child);

      if (child.children && child.children.length > 0) {
        createChildren(child);
      }
    });
  }
}

// 初始化节点时添加attr
function setInitialAttr(vnode) {
  if (!(vnode instanceof VComponentNode) && !(vnode instanceof VTextNode)) {
    const keys = Object.keys(vnode.attr || {});
    keys.forEach(key => {
      if (vnode.element && !isEventAttr(key)) {
        setAttr(vnode.element, key, vnode.attr[key]);
      }
    });
  }
}

/**
 * 添加事件
 * @param {*} vnode 
 */
function bindEventForVNode(vnode) {
  let node = vnode;
  if (vnode instanceof VComponentNode) {
    node = vnode.renderVNode;
  }
  if (node.element) {
    Object.keys(node.attr || {}).forEach(key => {
      if (isEventAttr(key)) {
        event(node.element, key, node.attr[key]);
      }
    });
  }
}

export {
  patch, 
  PatchType
}