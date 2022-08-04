
import { NodeType, issame, VComponentNode } from "./vnode";
import { isFunctionType, isStringType } from "./utils";
import { PatchType } from './patch';
import { event, isEventAttr } from "./event";


function diff(newVNode, oldVNode, parentNode) {
  
  let patches = [];

  const patch = diffVNode(newVNode, oldVNode, parentNode, patches);
  
  const shouldCompareChildren = (patch && (patch.type != PatchType.REMOVE && patch.type != PatchType.REPLACE)) || !patch;

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

  let patch = null;
  if (!newVNode && oldVNode) {
    
    patch = {
      type: PatchType.REMOVE,
      newVNode,
      oldVNode,
      parentNode
    };
    patches.push(patch);
  } else if (newVNode && !oldVNode) {
    patch = {
      type: PatchType.APPEND,
      newVNode,
      oldVNode,
      parentNode
    };
    patches.push(patch);
  } else if (newVNode && oldVNode) {
    // 元素未变更丢弃老的dom
    if (issame(newVNode, oldVNode)) {
      newVNode.element = oldVNode.element;
    }

    if (newVNode) {
      newVNode.parent = parentNode;
    }
    
    if (newVNode instanceof VComponentNode && oldVNode instanceof VComponentNode) {
      // 同为组件的情况下
      if (newVNode.constructor.name == oldVNode.constructor.name) {
        diffAttr(newVNode, oldVNode, patches);
        // 组件相同，比较其渲染节点
        return diffVNode(newVNode.renderVNode, oldVNode.renderVNode, parentNode, patches);
      } else {
        // 替换
        patch = {
          type: PatchType.REPLACE,
          newVNode,
          oldVNode,
          parentNode
        };
        patches.push(patch);
      }
    } else {
      if (newVNode.tag != oldVNode.tag || (newVNode.type == NodeType.Text && newVNode.text != oldVNode.text)) {
        // 替换
        patch = {
          type: PatchType.REPLACE,
          newVNode,
          oldVNode,
          parentNode
        };
        patches.push(patch);
      } else if (newVNode.tag == oldVNode.tag) {
        // 相同节点，比较属性
        diffAttr(newVNode, oldVNode, patches);
      }
    }
  }

  return patch;
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

  if (newVNode instanceof VComponentNode) {
    // props
    if (newVNode.propsChanged && isFunctionType(newVNode.propsChanged)) {
      newVNode.propsChanged.apply(newVNode, [newVNode.props, oldVNode.props]);
    }

    // 处理ref
    const ref = newVNode.props.ref;
    if (ref) {
      
      const directParentComponent = findDirectParentComponent(newVNode);
      if (directParentComponent) {

        if (isFunctionType(ref)) {
          ref.apply(directParentComponent, [newVNode]);
        } else if (isStringType(ref)) {
          directParentComponent.refs[newVNode.props.ref] = newVNode;
        }
      }
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
          oldVNode,
          attrKey: key,
          type: PatchType.REMOVE_ATTR
        });
      } else if (newValue && !oldValue) {
        // 新值有，旧值无，添加
        patches.push({
          newVNode,
          oldVNode,
          attrKey: key,
          value: newValue,
          type: PatchType.ADD_ATTR
        });
      } else if (newValue && oldValue) {
        // 都有值，比较值内容
        if (newValue !== oldValue) {
          // 替换
          patches.push({
            newVNode,
            oldVNode,
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


// 向上查找 component 
function findDirectParentComponent(node) {
  if (node) {
    if (node.parent) {
      if (node.parent.holder) {
        return node.parent.holder;
      } else {
        return findDirectParentComponent(node.parent);
      }
    }
  }
  return null;
}

export {
  PatchType,
  diff
}