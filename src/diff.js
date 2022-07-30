
import { NodeType, issame } from "./vnode";
import { createElement } from "./dom";
import { Component } from "./component";
import { isFunctionType } from "./utils";

const PatchType = {
  // 替换节点
  REPLACE: 1,

  // 删除节点
  REMOVE: 2,

  // 追加节点
  APPEND: 3,

  APPEND_ALL: 4,
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


function diff(newVNode, oldVNode, parentNode) {
  
  let patches = [];

  diffVNode(newVNode, oldVNode, parentNode, patches);
  
  const shouldCompareChildren = (patch && (patch.type != PatchType.REMOVE || patch.type != PatchType.REPLACE)) || !patch;

  if (oldVNode && newVNode && shouldCompareChildren) {
    // 两节点相同，处理后续子元素节点

    if (newVNode.children && newVNode.children.length > 0 && oldVNode.children && oldVNode.children.length > 0) {
      // 都存在子元素
      let iteratorChildren = newVNode.children;

      if (newVNode.children.length < oldVNode.children.length) {
        iteratorChildren = oldVNode.children;
      }

      iteratorChildren.forEach((_, index) => {
        let vOldChild = null;
        let vNewChild = null;
        if (oldVNode.children.length > index) {
          vOldChild = oldVNode.children[index];
        }

        if (newVNode.children.length > index) {
          vNewChild = newVNode.children[index];
        }

        const childrenPatches = diff(vNewChild, vOldChild, newVNode);
        patches = patches.concat(childrenPatches);
      });
    } else {
      
        if ((!newVNode.children || newVNode.children.length == 0) && (oldVNode.children && oldVNode.children.length > 0)) {
          // 新节点没有子元素，旧节点存在子元素
          // 清空子元素
          patches.push({
            type: PatchType.REMOVE_ALL,
            newVNode,
            oldVNode
          });
        } else if ((newVNode.children && newVNode.children.length > 0) && (!oldVNode.children || oldVNode.children.length == 0)) {
          // 新节点存在子元素，旧节点没有子元素
          // 添加新元素
          patches.push({
            type: PatchType.APPEND_ALL,
            newVNode,
            oldVNode
          });
        }
    }
  }

  return patches;
}

function diffVNode(newVNode, oldVNode, parentNode, patches) {

  if (!newVNode && oldVNode) {
    patches.push({
      type: PatchType.REMOVE,
      newVNode,
      oldVNode,
      parentNode
    });
  } else if (newVNode && !oldVNode) {
    patches.push({
      type: PatchType.APPEND,
      newVNode,
      oldVNode,
      parentNode
    });
  } else if (newVNode && oldVNode) {
    // 元素未变更丢弃老的dom
    if (issame(newVNode, oldVNode)) {
      newVNode.element = oldVNode.element;
    }

    if (newVNode) {
      newVNode.parent = parentNode;
    }
    
    if (newVNode instanceof Component && oldVNode instanceof Component) {
      // 同为组件的情况下
      if (newVNode.constructor.name == oldVNode.constructor.name) {
        diffAttr(newVNode, oldVNode, patches);
        // 组件相同，比较其渲染节点
        return diffVNode(newVNode.renderVNode, oldVNode.renderVNode, parentNode, patches);
      } else {
        // 替换
        return patches.push({
          type: PatchType.REPLACE,
          newVNode,
          oldVNode,
          parentNode
        });
      }
    } else {
      if (newVNode.tag != oldVNode.tag || (newVNode.type == NodeType.Text && newVNode.text != oldVNode.text)) {
        // 替换
        patches.push({
          type: PatchType.REPLACE,
          newVNode,
          oldVNode,
          parentNode
        });
      } else if (newVNode.tag == oldVNode.tag) {
        // 相同节点，比较属性
        diffAttr(newVNode, oldVNode, patches);
      }
    }
  }

  return null;
}

/**
 * 比较节点属性，此方法中两个节点类型一定相同，且不为文本节点
 * 
 * @param {*} newVNode 
 * @param {*} oldVNode 
 */
function diffAttr(newVNode, oldVNode, patches) {

  if (!patches) {
    patches = [];
  }

  if (newVNode instanceof Component) {
    // props
    if (newVNode.propsChanged && isFunctionType(newVNode.propsChanged)) {
      newVNode.propsChanged.apply(newVNode, [newVNode.props, oldVNode.props]);
    }
  } else {
    // 比较 attr
    newVNode.attr = newVNode.attr || {};
    oldVNode.attr = oldVNode.attr || {};
    const newAttrSet = Object.keys(newVNode.attr);
    const oldAttrSet = Object.keys(oldVNode.attr);
    let maxLength = Math.max(newAttrSet.length, oldAttrSet.length);

    let i = 0;
    while(i < maxLength) {
      const key = newAttrSet[i];
      
      const newValue = newVNode.attr[key];
      const oldValue = oldVNode.attr[key];

      if (!newValue && oldValue) {
        // 新值无，旧值有，移除
        patches.push({
          newVNode,
          attrKey: key,
          type: PatchType.REMOVE_ATTR
        });
      } else if (newValue && !oldValue) {
        // 新值有，旧值无，添加
        patches.push({
          newVNode,
          attrKey: key,
          value: newValue,
          type: PatchType.ADD_ATTR
        });
      } else if (newValue && oldValue) {
        // 都有值，比较值内容
        if (newValue !== oldValue) {
          console.log('属性变更了: ', key, oldValue, '->', newValue);
          // 替换
          patches.push({
            newVNode,
            attrKey: key,
            value: newValue,
            type: PatchType.REPLACE_ATTR
          });
        }
      }

      i++;
    }
  }
}

function createChildren(node) {
  // 处理子元素
  if (node.element && node.children && node.children.length > 0) {
    node.children.forEach(child => {
      createElement(child);
      if (child.element) {
        node.element.appendChild(child.element);
      }
      if (child.component && child.component.mounted) {
        child.component.mounted.apply(child.component, []);
        child.component._vnode = child;
      }

      if (child.children && child.children.length > 0) {
        createChildren(child);
      }
    });
  }
}

function patch(patches) {
  patches.forEach(patch => {
    const { newVNode, oldVNode, parentNode } = patch;
    switch(patch.type) {
      case PatchType.APPEND:

        // 追加dom节点
        if (parentNode && parentNode.element) {

          createElement(newVNode);
          
          newVNode.parent = parentNode;
          parentNode.element.appendChild(newVNode.element);
          if (newVNode.holder && newVNode.holder.mounted) {
            newVNode.holder.mounted.apply(newVNode.holder, []);
          }
          
          // 创建子元素
          createChildren(newVNode);
        }
        break;
      case PatchType.APPEND_ALL:
        break;
      case PatchType.MOVE:
        break;
      case PatchType.REMOVE:
        if (oldVNode.element) {
          oldVNode.element.remove();
        }

        if (oldVNode.holder && oldVNode.holder.unmounted) {
          oldVNode.holder.unmounted.apply(oldVNode.holder, []);
        }
        break;
      case PatchType.REPLACE:

        // 考虑组件情况的替换，因为组件与渲染节点(renderVNode) 共享element，此处无需做修改
        createElement(newVNode);
        if (newVNode.element && oldVNode.element) {
          newVNode.parent = parentNode;
          oldVNode.element.replaceWith(newVNode.element);
        }

        break;
      case PatchType.REPLACE_ATTR:
      case PatchType.ADD_ATTR:
        // 添加/替换属性
        if (newVNode.element) {
          const { attrKey, value } = patch;
          if (attrKey) {
            newVNode.element.setAttribute(attrKey, value);
          }
        }
        break;
      case PatchType.REMOVE_ATTR:
        // 属性移除
        if (newVNode.element) {
          const { attrKey } = patch;
          if (attrKey) {
            newVNode.element.removeAttribute(attrKey);
          }
        }
    }
  });
}

export {
  PatchType,
  diff,
  patch
}